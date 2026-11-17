import { describe, expect, it } from "vitest"

import { detectHasAudio } from "./video-audio"

// Each engine reports audio through a different property, so the element is
// faked with only the property under test.
const video = (signals: Record<string, unknown>) =>
  signals as unknown as HTMLVideoElement

describe("detectHasAudio", () => {
  it("is false when no engine reports audio", () => {
    expect(detectHasAudio(video({}))).toBe(false)
    expect(
      detectHasAudio(
        video({
          mozHasAudio: false,
          webkitAudioDecodedByteCount: 0,
          audioTracks: { length: 0 },
        }),
      ),
    ).toBe(false)
  })

  it("reads Firefox's mozHasAudio", () => {
    expect(detectHasAudio(video({ mozHasAudio: true }))).toBe(true)
  })

  it("reads Chrome's decoded audio byte count", () => {
    expect(detectHasAudio(video({ webkitAudioDecodedByteCount: 53420 }))).toBe(
      true,
    )
  })

  it("reads Safari's audioTracks list", () => {
    expect(detectHasAudio(video({ audioTracks: { length: 1 } }))).toBe(true)
  })
})
