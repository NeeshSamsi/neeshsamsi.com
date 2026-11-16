import type { Locator, Page } from "@playwright/test"

import { expect, load, test } from "./fixtures"

// Published projects with clips (content lives in Prismic):
const MOTION = "/projects/motion-class-with-po" // three silent clips
const WITH_AUDIO = "/projects/3d-for-designers" // one clip with an audio track

/** The parts of one PrismicVideo instance. */
function player(page: Page, index = 0) {
  const video = page.locator("video").nth(index)
  const root = video.locator("xpath=..")
  return {
    root,
    video,
    seek: root.getByRole("slider", { name: "Seek" }),
    toggle: root.getByRole("button", { name: /^(Play|Pause)$/ }),
    fill: root.locator("div.bg-dark").first(),
  }
}

const state = (video: Locator) =>
  video.evaluate((v: HTMLVideoElement) => ({
    paused: v.paused,
    muted: v.muted,
    currentTime: v.currentTime,
    duration: v.duration,
  }))

// The centre of the frame is covered by the play/pause button, so "click the
// video" means a corner of it.
const clickVideo = (video: Locator) =>
  video.click({ position: { x: 24, y: 24 } })

const seekMax = async (seek: Locator) => Number(await seek.getAttribute("max"))
const seekValue = async (seek: Locator) => Number(await seek.inputValue())

test.describe("PrismicVideo", () => {
  test("shows duration and moving progress after a warm-cache reload", async ({
    page,
  }) => {
    // On a warm cache the browser loads metadata and starts the autoplaying
    // clip before React hydrates, so `loadedmetadata` and `play` fire with no
    // listener attached. The UI still has to end up in step with the element.
    await load(page, MOTION)
    const { video, seek, toggle } = player(page)
    await video.scrollIntoViewIfNeeded()
    await expect
      .poll(async () => (await state(video)).duration)
      .toBeGreaterThan(0)

    for (let reload = 1; reload <= 3; reload++) {
      await load(page)
      await video.scrollIntoViewIfNeeded()

      const { duration } =
        await test.step(`reload ${reload}: metadata`, async () => {
          await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
          return state(video)
        })
      expect(await seekMax(seek)).toBeCloseTo(duration, 1)

      await test.step(`reload ${reload}: progress follows playback`, async () => {
        await expect.poll(async () => (await state(video)).paused).toBe(false)
        await expect(toggle).toHaveAccessibleName("Pause")
        const before = await seekValue(seek)
        await expect.poll(() => seekValue(seek)).not.toBe(before)
      })
    }
  })

  test("gives every clip on the page a duration", async ({ page }) => {
    await load(page, MOTION)
    const count = await page.locator("video").count()
    expect(count).toBe(3)

    for (let i = 0; i < count; i++) {
      const { video, seek } = player(page, i)
      await video.scrollIntoViewIfNeeded()
      await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
    }
  })

  test("pauses and resumes from the video and from the button", async ({
    page,
    browserProblems,
  }) => {
    await load(page, MOTION)
    const { root, video, toggle } = player(page)
    await video.scrollIntoViewIfNeeded()
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    const problemsAfterLoad = browserProblems.length

    await clickVideo(video)
    await expect.poll(async () => (await state(video)).paused).toBe(true)
    await expect(toggle).toHaveAccessibleName("Play")

    await root.hover()
    await toggle.click()
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    await expect(toggle).toHaveAccessibleName("Pause")

    // Rapid toggling interrupts play() calls; none may surface as an error.
    for (let i = 0; i < 6; i++) await clickVideo(video)
    await page.waitForTimeout(300)
    expect(browserProblems.slice(problemsAfterLoad)).toEqual([])
  })

  test("scrubs by dragging the progress bar", async ({ page }) => {
    await load(page, MOTION)
    const { video, seek, fill } = player(page)
    await video.scrollIntoViewIfNeeded()
    await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)

    // Pause so the position only changes because of the drag.
    await clickVideo(video)
    await expect.poll(async () => (await state(video)).paused).toBe(true)
    const { duration } = await state(video)

    const box = await seek.boundingBox()
    if (!box) throw new Error("seek bar is not laid out")
    const y = box.y + box.height / 2
    await page.mouse.move(box.x + box.width * 0.2, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.45, y, { steps: 8 })

    // Mid-drag the video already follows the pointer...
    await expect
      .poll(async () => (await state(video)).currentTime / duration)
      .toBeGreaterThan(0.3)

    await page.mouse.move(box.x + box.width * 0.7, y, { steps: 8 })
    await page.mouse.up()

    // ...and it lands where the pointer was released.
    const landed = (await state(video)).currentTime / duration
    expect(landed).toBeGreaterThan(0.6)
    expect(landed).toBeLessThan(0.8)

    // The visible fill and the slider agree with the element.
    expect((await seekValue(seek)) / duration).toBeCloseTo(landed, 2)
    const fillRatio = await fill.evaluate(
      (el) =>
        el.getBoundingClientRect().width /
        el.parentElement!.getBoundingClientRect().width,
    )
    expect(fillRatio).toBeGreaterThan(0.55)
    expect(fillRatio).toBeLessThan(0.85)
    expect((await state(video)).paused).toBe(true)
  })

  test("offers mute controls for a clip with audio once it plays", async ({
    page,
  }) => {
    await load(page, WITH_AUDIO)
    const { root, video, seek } = player(page)

    // The clip sits below the fold at this viewport; Chrome only autoplays
    // muted clips that are on screen.
    await video.scrollIntoViewIfNeeded()
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
    expect((await state(video)).muted).toBe(true)

    await root.hover()
    const unmute = root.getByRole("button", { name: "Unmute" })
    await unmute.click()
    expect((await state(video)).muted).toBe(false)

    await root.getByRole("button", { name: "Mute", exact: true }).click()
    expect((await state(video)).muted).toBe(true)
  })

  test("has no mute control for silent clips", async ({ page }) => {
    await load(page, MOTION)
    const { root, video, seek } = player(page)
    await video.scrollIntoViewIfNeeded()
    await expect.poll(() => seekValue(seek)).toBeGreaterThan(0.5)

    await expect(root.getByRole("button", { name: /mute/i })).toHaveCount(0)
  })
})

test.describe("PrismicVideo with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } })

  test("stays paused, including after a warm-cache reload, until asked to play", async ({
    page,
  }) => {
    await load(page, MOTION)
    const { video, seek, toggle } = player(page)

    for (const visit of ["first load", "warm reload"]) {
      await test.step(visit, async () => {
        if (visit === "warm reload") await load(page)
        await video.scrollIntoViewIfNeeded()
        await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)

        // The server renders `autoplay` (it can't know the preference), so
        // the clip may start before hydration. It must be stopped, and stay
        // stopped while on screen.
        await expect.poll(async () => (await state(video)).paused).toBe(true)
        const settled = (await state(video)).currentTime
        await page.waitForTimeout(1500)
        const later = await state(video)
        expect(later.paused).toBe(true)
        expect(later.currentTime).toBe(settled)

        // Controls stay visible while paused so the clip is clearly playable.
        await expect(toggle).toHaveAccessibleName("Play")
        await expect(seek.locator("xpath=../..")).toHaveCSS("opacity", "1")
      })
    }

    await toggle.click()
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    await expect(toggle).toHaveAccessibleName("Pause")
  })
})
