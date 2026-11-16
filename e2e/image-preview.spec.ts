import { expect, load, test } from "./fixtures"

// A project whose double-media rows hold images (they open in a preview).
const PROJECT = "/projects/aavartan-2025"

test.describe("image preview", () => {
  test("opens from an image and closes from the button or Escape", async ({
    page,
  }) => {
    await load(page, PROJECT)
    const trigger = page.locator("main button:has(img)").first()
    await trigger.scrollIntoViewIfNeeded()

    await trigger.click()
    // The dialog element itself has no box (its panel is position: fixed), so
    // visibility is checked on the enlarged image inside it.
    const dialog = page.getByRole("dialog")
    const enlarged = dialog.locator("img")
    await expect(enlarged).toBeVisible()
    await expect(dialog).toHaveAccessibleName(/.+/)

    await dialog.getByRole("button", { name: "Close preview" }).click()
    await expect(dialog).toHaveCount(0)

    await trigger.click()
    await expect(enlarged).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(dialog).toHaveCount(0)
  })

  test("the close button is reachable from the keyboard", async ({ page }) => {
    await load(page, PROJECT)
    const trigger = page.locator("main button:has(img)").first()
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const close = page.getByRole("button", { name: "Close preview" })
    await expect(close).toBeVisible()

    await close.focus()
    await page.keyboard.press("Enter")

    await expect(page.getByRole("dialog")).toHaveCount(0)
  })
})
