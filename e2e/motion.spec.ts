import type { Page } from "@playwright/test"

import { expect, load, test } from "./fixtures"

// Lenis marks the document while it is driving the scroll.
const smoothScrolling = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("lenis"))

test.describe("smooth scrolling", () => {
  test("is on by default", async ({ page }) => {
    await load(page, "/work")

    await expect.poll(() => smoothScrolling(page)).toBe(true)
  })

  test("follows the preference when it changes on an open page", async ({
    page,
  }) => {
    await load(page, "/work")
    await expect.poll(() => smoothScrolling(page)).toBe(true)

    await page.emulateMedia({ reducedMotion: "reduce" })
    await expect.poll(() => smoothScrolling(page)).toBe(false)

    await page.emulateMedia({ reducedMotion: "no-preference" })
    await expect.poll(() => smoothScrolling(page)).toBe(true)
  })
})

test.describe("smooth scrolling with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } })

  test("is off, and the page scrolls natively", async ({ page }) => {
    await load(page, "/work")
    // Give the layout's effects time to run before concluding nothing started.
    await expect(page.locator("nav")).toBeVisible()
    await page.waitForTimeout(500)
    expect(await smoothScrolling(page)).toBe(false)

    // Native scrolling moves the page by the full wheel delta at once; Lenis
    // would ease towards it over many frames.
    await page.mouse.move(640, 450)
    await page.mouse.wheel(0, 600)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(600)
  })
})
