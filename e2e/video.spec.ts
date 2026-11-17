import type { Locator, Page } from "@playwright/test"

import { expect, load, test } from "./fixtures"

// Published projects with clips (content lives in Prismic):
const MOTION = "/projects/motion-class-with-po" // three silent clips
const WITH_AUDIO = "/projects/3d-for-designers" // one clip with an audio track

/**
 * The parts of one PrismicVideo instance. The clips play from Mux through
 * Video.js, whose controls carry the roles and labels used here.
 */
function player(page: Page, index = 0) {
  const video = page.locator("video").nth(index)
  const root = video.locator("xpath=..")
  const seek = root.getByRole("slider", { name: "Seek" })
  return {
    root,
    video,
    seek,
    toggle: root.getByRole("button", { name: /^(Play|Pause)$/ }),
    fill: root.locator(".bg-dark").first(),
    // The storyboard frame shown above the pointer on the seek bar.
    thumbnail: seek.locator("xpath=..").locator("img"),
  }
}

const state = (video: Locator) =>
  video.evaluate((v: HTMLVideoElement) => ({
    paused: v.paused,
    muted: v.muted,
    currentTime: v.currentTime,
    duration: v.duration,
  }))

/**
 * Brings a clip on screen once its player has replaced the poster. The poster
 * is a placeholder element that is swapped out when the player chunk loads,
 * so anything done before that would act on an element about to go away.
 */
async function show({ video, seek }: { video: Locator; seek: Locator }) {
  await expect(seek).toBeAttached()
  await video.scrollIntoViewIfNeeded()
}

// The centre of the frame is covered by the play/pause button, so "click the
// video" means a corner of it.
const clickVideo = (video: Locator) =>
  video.click({ position: { x: 24, y: 24 } })

// The slider reports the clip's length and position through ARIA. Until the
// player has loaded there is no slider yet, which counts as "no duration".
const ariaNumber = async (seek: Locator, name: string) =>
  (await seek.count()) ? Number(await seek.getAttribute(name)) : 0
const seekMax = (seek: Locator) => ariaNumber(seek, "aria-valuemax")
const seekValue = (seek: Locator) => ariaNumber(seek, "aria-valuenow")

test.describe("PrismicVideo", () => {
  test("plays from Mux, with the poster in place before the player loads", async ({
    page,
  }) => {
    await load(page, MOTION)
    const { video, seek } = player(page)
    // The poster is part of the server-rendered HTML.
    const html = await (await page.request.get(MOTION)).text()
    expect(html).toMatch(/<video[^>]+poster="https:\/\/images\.prismic\.io\//)

    await show({ video, seek })
    await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    // Chrome plays the HLS stream through Media Source Extensions, so the
    // element's source is a blob; nothing is loaded from Prismic's file CDN.
    const src = await video.evaluate((v: HTMLVideoElement) => v.currentSrc)
    expect(src).toMatch(/^blob:|stream\.mux\.com/)
  })

  test("shows duration and moving progress after a warm-cache reload", async ({
    page,
  }) => {
    // The controls have to end up in step with the element on every load,
    // including reloads where the stream and the player chunk are cached.
    await load(page, MOTION)
    const { video, seek, toggle } = player(page)
    await show({ video, seek })
    await expect
      .poll(async () => (await state(video)).duration)
      .toBeGreaterThan(0)

    for (let reload = 1; reload <= 3; reload++) {
      await load(page)
      await show({ video, seek })

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
      await show({ video, seek })
      await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
    }
  })

  test("pauses and resumes from the video and from the button", async ({
    page,
    browserProblems,
  }) => {
    await load(page, MOTION)
    const { root, video, seek, toggle } = player(page)
    await show({ video, seek })
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
    await show({ video, seek })
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

    // Mid-drag the video already follows the pointer (Video.js seeks while
    // dragging)...
    await expect
      .poll(async () => (await state(video)).currentTime / duration)
      .toBeGreaterThan(0.3)

    await page.mouse.move(box.x + box.width * 0.7, y, { steps: 8 })
    await page.mouse.up()

    // ...and it lands where the pointer was released.
    await expect
      .poll(async () => (await state(video)).currentTime / duration)
      .toBeGreaterThan(0.6)
    const landed = (await state(video)).currentTime / duration
    expect(landed).toBeLessThan(0.8)

    // The visible fill and the slider agree with the element.
    await expect
      .poll(async () => Math.abs((await seekValue(seek)) / duration - landed))
      .toBeLessThan(0.01)
    const fillRatio = await fill.evaluate(
      (el) =>
        el.getBoundingClientRect().width /
        el.parentElement!.getBoundingClientRect().width,
    )
    expect(fillRatio).toBeGreaterThan(0.55)
    expect(fillRatio).toBeLessThan(0.85)
    expect((await state(video)).paused).toBe(true)
  })

  test("holds a playing clip still while scrubbing and resumes it on release", async ({
    page,
  }) => {
    await load(page, MOTION)
    const { video, seek } = player(page)
    await show({ video, seek })
    await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)
    await expect.poll(async () => (await state(video)).paused).toBe(false)

    const box = await seek.boundingBox()
    if (!box) throw new Error("seek bar is not laid out")
    const y = box.y + box.height / 2
    await page.mouse.move(box.x + box.width * 0.2, y)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.5, y, { steps: 8 })

    // Paused for as long as the pointer is held, so the frame under it stays
    // put. (The last throttled seek can still land after the pause, so the
    // position itself may move once.)
    await expect.poll(async () => (await state(video)).paused).toBe(true)
    await page.waitForTimeout(500)
    expect((await state(video)).paused).toBe(true)
    const dropped = (await state(video)).currentTime

    await page.mouse.up()

    // Playing again from where it was dropped.
    await expect.poll(async () => (await state(video)).paused).toBe(false)
    await expect
      .poll(async () => (await state(video)).currentTime)
      .toBeGreaterThan(dropped)
  })

  test("shows a storyboard thumbnail above the pointer on the seek bar", async ({
    page,
  }) => {
    await load(page, MOTION)
    const { root, video, seek, thumbnail } = player(page)
    await show({ video, seek })
    await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)

    // Hovering the clip slides the controls into place; measure the bar there.
    await root.hover()
    await expect(seek.locator("xpath=../..")).toHaveCSS("opacity", "1")
    await expect(seek.locator("xpath=../..")).toHaveCSS("translate", "0px")
    const box = await seek.boundingBox()
    if (!box) throw new Error("seek bar is not laid out")
    const y = box.y + box.height / 2
    const bubble = thumbnail.locator("xpath=..")

    await page.mouse.move(box.x + box.width * 0.3, y)
    await expect(thumbnail).toHaveAttribute(
      "src",
      /^https:\/\/image\.mux\.com\//,
    )
    await expect(bubble).toHaveCSS("opacity", "1")
    // The bubble clips one frame out of the storyboard sprite, so measure it
    // and not the image inside.
    const first = await bubble.boundingBox()
    if (!first) throw new Error("thumbnail is not laid out")
    // It sits above the bar, around the pointer.
    expect(first.y + first.height).toBeLessThanOrEqual(box.y)
    expect(first.x).toBeLessThan(box.x + box.width * 0.3)
    expect(first.x + first.width).toBeGreaterThan(box.x + box.width * 0.3)

    // It follows the pointer...
    await page.mouse.move(box.x + box.width * 0.7, y, { steps: 5 })
    await expect
      .poll(async () => (await bubble.boundingBox())?.x ?? 0)
      .toBeGreaterThan(first.x + 20)
    // ...without seeking the clip, and goes away with the pointer.
    await page.mouse.move(5, 5)
    await expect(bubble).toHaveCSS("opacity", "0")
  })

  test("offers mute controls for a clip with audio once it plays", async ({
    page,
  }) => {
    await load(page, WITH_AUDIO)
    const { root, video, seek } = player(page)

    // The clip sits below the fold at this viewport; Chrome only autoplays
    // muted clips that are on screen.
    await show({ video, seek })
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
    await show({ video, seek })
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
        await show({ video, seek })
        await expect.poll(() => seekMax(seek)).toBeGreaterThan(0)

        // The player only renders in the browser, where the preference is
        // known, so the clip must never start, and must stay stopped while
        // on screen.
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
