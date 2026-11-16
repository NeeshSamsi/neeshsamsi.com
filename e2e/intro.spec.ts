import { expect, load, test } from "./fixtures"

// What the home intro hides until GSAP reveals it (see PREHIDE_CSS in
// src/components/HomeIntro.tsx).
const INTRO_TARGETS = [
  '[data-intro="card"]',
  '[data-intro="navbar"] > *',
  '[data-intro="titles"] > *',
  '[data-intro="contact"] > *',
]

const PREHIDE_QUERY =
  "(prefers-reduced-motion: no-preference) and (scripting: enabled)"

test.describe("home intro without JavaScript", () => {
  test.use({ javaScriptEnabled: false })

  test("shows the navbar, featured card and contact pill", async ({ page }) => {
    // Plain goto: with scripts off Chrome refuses every chunk request, which
    // `load` would read as a broken dev-server chunk and reload for.
    await page.goto("/")

    for (const selector of INTRO_TARGETS) {
      const targets = page.locator(selector)
      expect(await targets.count(), selector).toBeGreaterThan(0)
      for (const target of await targets.all()) {
        await expect(target, selector).toHaveCSS("opacity", "1")
      }
    }
  })
})

test.describe("home intro with JavaScript", () => {
  test("pre-hides the intro elements before the animation runs", async ({
    page,
  }) => {
    await load(page, "/")

    expect(
      await page.evaluate((query) => matchMedia(query).matches, PREHIDE_QUERY),
    ).toBe(true)
  })
})
