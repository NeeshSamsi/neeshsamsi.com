import type { Page } from "@playwright/test"

import { expect, load, test } from "./fixtures"

const canonicalPath = async (page: Page) => {
  const href = await page.locator('link[rel="canonical"]').getAttribute("href")
  return new URL(href ?? "").pathname
}

const meta = (page: Page, key: string) =>
  page
    .locator(`meta[property="${key}"], meta[name="${key}"]`)
    .getAttribute("content")

// Titles and descriptions are CMS content, so these check structure only:
// that each page has its own, and points at itself.
const PAGES = [
  { path: "/", canonical: "/" },
  { path: "/work", canonical: "/work" },
  { path: "/play", canonical: "/play" },
  { path: "/notes", canonical: "/notes" },
  {
    path: "/projects/3d-for-designers",
    canonical: "/projects/3d-for-designers",
  },
  {
    path: "/notes/nextjs-project-setup",
    canonical: "/notes/nextjs-project-setup",
  },
]

test.describe("page metadata", () => {
  for (const { path, canonical } of PAGES) {
    test(`${path} describes itself`, async ({ page }) => {
      await load(page, path)

      expect(await canonicalPath(page)).toBe(canonical)
      expect(new URL((await meta(page, "og:url")) ?? "").pathname).toBe(
        canonical,
      )

      const title = await page.title()
      expect(title.trim()).not.toBe("")
      expect(await meta(page, "og:title")).toBeTruthy()
      expect(await meta(page, "og:image")).toMatch(/^https:\/\//)
      // The share card names this page, not the site-wide default.
      expect(await meta(page, "twitter:title")).toBe(
        await meta(page, "og:title"),
      )
    })
  }

  test("inner pages have their own titles", async ({ page }) => {
    const titles = new Set<string>()
    for (const { path } of PAGES) {
      await load(page, path)
      titles.add(await page.title())
    }

    expect(titles.size).toBe(PAGES.length)
  })
})

test.describe("document structure", () => {
  test("a project page starts its outline at the h1", async ({ page }) => {
    await load(page, "/projects/3d-for-designers")

    const headings = await page
      .locator("main :is(h1, h2, h3, h4)")
      .evaluateAll((els) => els.map((el) => el.tagName))
    expect(headings[0]).toBe("H1")
    expect(headings.filter((tag) => tag === "H1")).toHaveLength(1)
  })

  test("element ids are unique on the home page", async ({ page }) => {
    await load(page, "/")

    const ids = await page
      .locator("[id]")
      .evaluateAll((els) => els.map((el) => el.id))
    const duplicates = ids.filter((id, i) => id && ids.indexOf(id) !== i)
    expect(duplicates).toEqual([])
  })
})

test.describe("routing", () => {
  test("unknown documents return the 404 page", async ({ page }) => {
    for (const path of [
      "/no-such-page",
      "/projects/no-such-project",
      "/notes/no-such-note",
    ]) {
      const response = await load(page, path)

      expect(response?.status(), path).toBe(404)
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "could not be found",
      )
    }
  })

  test("/home redirects to the canonical root", async ({ page }) => {
    await load(page, "/home")

    expect(new URL(page.url()).pathname).toBe("/")
  })

  test("the sitemap lists each routed page once, at its own URL", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml")
    expect(response.status()).toBe(200)

    const paths = [
      ...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
    ].map(([, loc]) => new URL(loc).pathname)
    expect(new Set(paths).size).toBe(paths.length)
    for (const { canonical } of PAGES) expect(paths).toContain(canonical)
    expect(paths).not.toContain("/home")
  })
})
