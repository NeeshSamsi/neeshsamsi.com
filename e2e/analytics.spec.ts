import type { Locator, Page } from "@playwright/test"

import { expect, load, test as base } from "./fixtures"

// These tests run the REAL Umami tracker against the site and read what it
// tries to send. src/components/Umami.tsx renders on the production deployment
// only, so each test adds the tracker's script tag itself. Every request the
// tracker makes is answered here and never leaves the machine.
//
// The script itself is the one production serves: it is fetched once per run
// through the dev server's /u/ rewrite and handed to every page from memory.
// (One fetch, because the Umami host's firewall challenges a burst of them.)
const WEBSITE_ID = "c98851cd-fce3-401d-aae0-6249488c14e1"
const UMAMI_HOST = "umami.neeshsamsi.com"

// Pages with the content each test needs (structure only, no copy).
const PROJECT_WITH_LINKS = "/projects/yogeshsamsi" // a callout and inline links
const PROJECT_WITH_IMAGES = "/projects/aavartan-2025"

type Sent = {
  type: string
  payload: {
    website: string
    name?: string
    data?: Record<string, unknown>
    url?: string
    title?: string
  }
}

type Umami = {
  /** Everything the tracker posted to /u/api/send, in order. */
  sent: Sent[]
  /** The data of each custom event with this name. */
  events: (name: string) => (Record<string, unknown> | undefined)[]
  /** Pageviews: the tracker's events without a name. */
  pageviews: () => Sent["payload"][]
  /** Adds the tracker to the loaded page and waits for its first pageview. */
  start: (page: Page) => Promise<void>
}

const test = base.extend<{ umami: Umami }, { trackerScript: string }>({
  trackerScript: [
    async ({ playwright }, provide, workerInfo) => {
      const api = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
      })
      const response = await api.get("/u/a.js")
      expect(
        response.status(),
        "the tracker script, proxied from the Umami host by the dev server",
      ).toBe(200)
      const script = await response.text()
      await api.dispose()
      await provide(script)
    },
    { scope: "worker" },
  ],

  umami: async ({ context, baseURL, trackerScript }, provide) => {
    const sent: Sent[] = []
    // Requests that must never happen: anything to the Umami server, any
    // other tracker endpoint, and any other write (the contact form posts to
    // a real Discord webhook).
    const forbidden: string[] = []
    const site = new URL(baseURL ?? "http://localhost:3000").origin

    await context.route("**/*", async (route) => {
      const request = route.request()
      const url = new URL(request.url())
      const label = `${request.method()} ${request.url()}`

      if (url.hostname === UMAMI_HOST) {
        forbidden.push(label)
        return route.abort()
      }
      if (url.origin === site && url.pathname === "/u/a.js") {
        return route.fulfill({
          contentType: "application/javascript",
          body: trackerScript,
        })
      }
      if (url.origin === site && url.pathname.startsWith("/u/api/")) {
        if (url.pathname === "/u/api/send" && request.method() === "POST") {
          sent.push(request.postDataJSON() as Sent)
          return route.fulfill({ json: { cache: "e2e" } })
        }
        forbidden.push(label)
        return route.abort()
      }
      if (request.method() !== "GET") {
        forbidden.push(label)
        return route.abort()
      }
      // Outbound links open other sites in a new tab. Don't load them.
      if (request.resourceType() === "document" && url.origin !== site) {
        return route.abort()
      }
      return route.fallback()
    })

    const pageviews = () =>
      sent
        .filter(({ type, payload }) => type === "event" && !payload.name)
        .map(({ payload }) => payload)

    await provide({
      sent,
      pageviews,
      events: (name) =>
        sent
          .filter(
            ({ type, payload }) => type === "event" && payload.name === name,
          )
          .map(({ payload }) => payload.data),
      start: async (page) => {
        await page.evaluate(
          (websiteId) =>
            new Promise<void>((resolve, reject) => {
              const script = document.createElement("script")
              script.src = "/u/a.js"
              script.dataset.websiteId = websiteId
              script.dataset.excludeHash = "true"
              script.onload = () => resolve()
              script.onerror = () => reject(new Error("tracker did not load"))
              document.head.append(script)
            }),
          WEBSITE_ID,
        )
        // The tracker listens for clicks from the moment it sends its first
        // pageview.
        await expect.poll(() => pageviews().length).toBeGreaterThan(0)
      },
    })

    expect(forbidden, "requests that must never be made").toEqual([])
    for (const { payload } of sent) expect(payload.website).toBe(WEBSITE_ID)
  },
})

/** Loads a page, waits for React to take it over, and starts the tracker. */
async function open(page: Page, umami: Umami, path: string) {
  const response = await load(page, path)
  await hydrated(page.locator("main"))
  await umami.start(page)
  return response
}

// React stores its props on a DOM node once it has hydrated it. A link clicked
// before that would do a full page load however it is tracked.
async function hydrated(locator: Locator) {
  await expect
    .poll(() =>
      locator
        .first()
        .evaluate((element) =>
          Object.keys(element).some((key) => key.startsWith("__reactProps")),
        ),
    )
    .toBe(true)
}

/**
 * Clicks a link to a page on this site and checks that Next navigated
 * client-side: a full page load would throw the window (and the mark) away.
 */
async function expectClientNavigation(
  page: Page,
  click: () => Promise<void>,
  url: RegExp | string,
) {
  await page.evaluate(() => {
    ;(window as Window & { __sameDocument?: boolean }).__sameDocument = true
  })
  await click()
  await expect(page).toHaveURL(url)
  expect(
    await page.evaluate(
      () => (window as Window & { __sameDocument?: boolean }).__sameDocument,
    ),
  ).toBe(true)
}

/** Clicks a link that opens another site in a new tab, and closes the tab. */
async function clickOutbound(page: Page, link: Locator) {
  await expect(link).toHaveAttribute("target", "_blank")
  const popup = page.waitForEvent("popup")
  await link.click()
  await (await popup).close()
}

const attribute = async (locator: Locator, name: string) => {
  const value = await locator.getAttribute(name)
  expect(value, name).toBeTruthy()
  return value as string
}

test.describe("analytics", () => {
  test("the tracker records a pageview and sends it nowhere but the local stub", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")

    const [pageview] = umami.pageviews()
    expect(pageview.url).toMatch(/\/work$/)
    expect(pageview.title).toBeTruthy()
  })

  test("social links in the navbar and footer record an outbound click", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")

    for (const location of ["navbar", "footer"]) {
      const link = page
        .locator(
          `a[data-umami-event="outbound_click"][data-umami-event-location="${location}"]`,
        )
        .first()
      const target = await attribute(link, "data-umami-event-target")
      await link.scrollIntoViewIfNeeded()

      await clickOutbound(page, link)

      await expect
        .poll(() => umami.events("outbound_click"))
        .toContainEqual({ kind: "social", target, location })
    }
    await expect(page).toHaveURL(/\/work$/)
  })

  test("the footer email link records an email click without the address", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")
    const link = page.locator('footer a[href^="mailto:"]')
    await link.scrollIntoViewIfNeeded()

    await link.click()

    await expect
      .poll(() => umami.events("email_click"))
      .toEqual([{ location: "footer" }])
    expect(JSON.stringify(umami.events("email_click"))).not.toContain("@")
  })

  test("the callout and inline links record an outbound click by hostname", async ({
    page,
    umami,
  }) => {
    await open(page, umami, PROJECT_WITH_LINKS)

    for (const kind of ["callout", "inline"]) {
      const link = page
        .locator(`main a[data-umami-event-kind="${kind}"]`)
        .first()
      const host = new URL(await attribute(link, "href")).hostname
      await link.scrollIntoViewIfNeeded()

      await clickOutbound(page, link)

      await expect
        .poll(() => umami.events("outbound_click"))
        .toContainEqual({ kind, host })
    }
  })

  test("a project card records its click and still navigates client-side", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")
    const card = page.locator('[data-umami-event="project_card_click"]').first()
    const project = await attribute(card, "data-umami-event-project")
    const section = await attribute(card, "data-umami-event-section")
    await card.scrollIntoViewIfNeeded()

    await expectClientNavigation(
      page,
      () => card.click(),
      new RegExp(`/projects/${project}$`),
    )

    expect(umami.events("project_card_click")).toEqual([
      { project, position: "1", section },
    ])
    // The tracker follows the client-side navigation with a pageview.
    await expect
      .poll(() => umami.pageviews().map(({ url }) => url))
      .toContainEqual(expect.stringMatching(`/projects/${project}$`))
  })

  test("the featured project records its click and still navigates client-side", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/")
    const card = page.locator('a[data-intro="card"]')
    // The home intro reveals the card.
    await expect(card).toHaveCSS("opacity", "1")
    const project = await attribute(
      card.locator('[data-umami-event="featured_project_click"]'),
      "data-umami-event-project",
    )

    await expectClientNavigation(
      page,
      () => card.click(),
      new RegExp(`/projects/${project}$`),
    )

    expect(umami.events("featured_project_click")).toEqual([{ project }])
  })

  test("a showcase button records a click on its padding and navigates client-side", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/")
    const button = page
      .locator('a:has(> [data-umami-event="showcase_cta_click"])')
      .first()
    const section = await attribute(
      button.locator("> span"),
      "data-umami-event-section",
    )
    const href = await attribute(button, "href")
    await button.scrollIntoViewIfNeeded()
    // Its scroll-triggered reveal moves it; wait for it to settle.
    await expect(button).toHaveCSS("opacity", "1")

    await expectClientNavigation(
      page,
      // The corner of the button, outside its label.
      () => button.click({ position: { x: 3, y: 3 } }),
      new RegExp(`${href}$`),
    )

    expect(umami.events("showcase_cta_click")).toEqual([{ section }])
  })

  test("a footer nav link records its click and still navigates client-side", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")
    const label = page.locator(
      'footer [data-umami-event="nav_click"][data-umami-event-target="play"]',
    )
    await label.scrollIntoViewIfNeeded()

    await expectClientNavigation(page, () => label.click(), /\/play$/)

    expect(umami.events("nav_click")).toEqual([
      { target: "play", location: "footer" },
    ])
  })

  test("a note records its click and still navigates client-side", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/notes")
    const title = page
      .locator('main [data-umami-event="note_card_click"]')
      .first()
    const note = await attribute(title, "data-umami-event-note")

    await expectClientNavigation(
      page,
      () => title.click(),
      new RegExp(`/notes/${note}$`),
    )

    expect(umami.events("note_card_click")).toEqual([{ note }])
  })

  test("no link to a page on this site carries the event attributes", async ({
    page,
  }) => {
    for (const path of [
      "/",
      "/work",
      "/notes",
      PROJECT_WITH_LINKS,
      "/missing",
    ]) {
      await load(page, path)
      const hrefs = await page
        .locator("a[data-umami-event]")
        .evaluateAll((links) => links.map((link) => link.getAttribute("href")))

      expect(hrefs.length, path).toBeGreaterThan(0)
      for (const href of hrefs) expect(href, path).toMatch(/^(https?:|mailto:)/)
    }
  })

  // The form posts to a real Discord webhook: it is opened and closed here,
  // never submitted (the fixture also refuses every write).
  test("the contact widget records how it was opened and closed", async ({
    page,
    umami,
  }) => {
    await open(page, umami, "/work")
    const pill = page.locator(
      '[role="button"][aria-expanded="false"][tabindex="0"]',
    )
    const send = page.getByRole("button", { name: "Send message" })

    await pill.click()
    await expect(send).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(pill).toBeVisible()

    await pill.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByLabel("Your email")).toBeFocused()
    await page.getByLabel("Message").fill("typed, never sent")
    await page.getByRole("button", { name: "Close contact form" }).click()
    await expect(pill).toBeVisible()

    await expect
      .poll(() => umami.events("contact_close"))
      .toEqual([
        { had_input: false, method: "escape" },
        { had_input: true, method: "button" },
      ])
    expect(umami.events("contact_open")).toEqual([
      { trigger: "pointer" },
      { trigger: "keyboard" },
    ])
    expect(JSON.stringify(umami.sent)).not.toContain("typed, never sent")
    expect(umami.events("contact_sent")).toEqual([])
    expect(umami.events("contact_submit_click")).toEqual([])
  })

  test("opening an image preview is recorded", async ({ page, umami }) => {
    await open(page, umami, PROJECT_WITH_IMAGES)
    const trigger = page.locator("main button:has(img)").first()
    await trigger.scrollIntoViewIfNeeded()

    await trigger.click()

    await expect(page.getByRole("dialog").locator("img")).toBeVisible()
    await expect.poll(() => umami.events("image_preview_open")).toHaveLength(1)
  })

  test("a missing page has its own title and a tracked way home", async ({
    page,
    umami,
  }) => {
    const response = await open(page, umami, "/this-page-does-not-exist")

    expect(response?.status()).toBe(404)
    await expect(page).toHaveTitle(/^Page not found/)
    expect(umami.pageviews()[0].title).toMatch(/^Page not found/)

    const button = page.locator(
      'main a:has(> [data-umami-event="not_found_home_click"])',
    )
    await expectClientNavigation(
      page,
      () => button.click({ position: { x: 3, y: 3 } }),
      /^[^/]*\/\/[^/]+\/$/,
    )

    expect(umami.events("not_found_home_click")).toHaveLength(1)
  })

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`the session records reduced motion (${reducedMotion})`, async ({
      page,
      umami,
    }) => {
      await page.emulateMedia({ reducedMotion })
      // The site asks for this before the tracker exists, as in production.
      await open(page, umami, "/work")

      const sessionData = () =>
        umami.sent
          .filter(({ type }) => type === "identify")
          .map(({ payload }) => payload.data)
      await expect.poll(sessionData).not.toHaveLength(0)
      for (const data of sessionData()) {
        expect(data).toEqual({ reduced_motion: reducedMotion === "reduce" })
      }
    })
  }
})
