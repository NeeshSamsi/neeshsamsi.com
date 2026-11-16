import type { Page } from "@playwright/test"

import { expect, load, test } from "./fixtures"

// The form posts to a real Discord webhook. Nothing here may ever submit it,
// so every non-GET request from the page is refused and recorded.
async function blockSubmissions(page: Page) {
  const attempts: string[] = []
  await page.route("**/*", (route) => {
    const request = route.request()
    if (request.method() === "GET") return route.fallback()
    attempts.push(`${request.method()} ${request.url()}`)
    return route.abort()
  })
  return attempts
}

// The closed widget: a button that expands into the form. Its label is CMS
// content, so it is found by role and state.
const pill = (page: Page) =>
  page.locator('[role="button"][aria-expanded="false"][tabindex="0"]')
const email = (page: Page) => page.getByLabel("Your email")
const message = (page: Page) => page.getByLabel("Message")
const send = (page: Page) => page.getByRole("button", { name: "Send message" })

// Collapsed, the form stays in the DOM (it animates open) but is inert, which
// takes it out of the tab order and the accessibility tree.
const expectClosed = async (page: Page) => {
  await expect(pill(page)).toBeVisible()
  await expect(page.locator("form").locator("xpath=..")).toHaveAttribute(
    "inert",
    "",
  )
}
const expectOpen = async (page: Page) => {
  await expect(pill(page)).toHaveCount(0)
  await expect(send(page)).toBeVisible()
  await expect(page.locator("form").locator("xpath=..")).not.toHaveAttribute(
    "inert",
    "",
  )
}

test.describe("contact widget", () => {
  test.beforeEach(async ({ page }) => {
    // /work has no intro animation holding the widget back.
    await load(page, "/work")
    await expectClosed(page)
  })

  test("opens and closes with the keyboard alone", async ({ page }) => {
    await pill(page).focus()
    await page.keyboard.press("Enter")

    await expect(email(page)).toBeFocused()
    await expectOpen(page)

    await page.keyboard.press("Escape")

    await expectClosed(page)
    await expect(pill(page)).toBeFocused()
  })

  test("opens with a click and closes with the close button or an outside click", async ({
    page,
  }) => {
    await pill(page).click()
    await expectOpen(page)

    await page.getByRole("button", { name: "Close contact form" }).click()
    await expectClosed(page)

    await pill(page).click()
    await expectOpen(page)
    await page.locator("main").click({ position: { x: 5, y: 5 } })
    await expectClosed(page)
  })

  test("validates in the browser without sending anything", async ({
    page,
  }) => {
    const attempts = await blockSubmissions(page)
    await pill(page).click()

    await send(page).click()
    await expect(page.getByText("Email is required.")).toBeVisible()
    await expect(page.getByText("Message is required.")).toBeVisible()
    await expect(email(page)).toHaveAttribute("aria-invalid", "true")
    await expect(email(page)).toHaveAccessibleDescription("Email is required.")

    await email(page).fill("not-an-email")
    await message(page).fill("hey")
    await send(page).click()
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeVisible()
    await expect(
      page.getByText("Message must be at least 5 characters."),
    ).toBeVisible()

    // Errors clear as soon as the field is fixed.
    await email(page).fill("someone@example.com")
    await expect(
      page.getByText("Please enter a valid email address."),
    ).toBeHidden()
    await expect(email(page)).not.toHaveAttribute("aria-invalid", "true")

    expect(attempts).toEqual([])
  })
})
