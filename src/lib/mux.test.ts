import type { ImageField } from "@prismicio/client"
import { describe, expect, it } from "vitest"

import { muxPlaybackId, muxThumbnailUrl, videoPosterUrl } from "./mux"

const image = {
  id: "abc",
  url: "https://images.prismic.io/neeshsamsi/poster.jpg?auto=format,compress",
  alt: null,
  copyright: null,
  dimensions: { width: 1080, height: 1920 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
} as ImageField

describe("muxPlaybackId", () => {
  it("returns the ID an editor entered", () => {
    expect(muxPlaybackId("TvGMRGGNSw027OfCxUt400")).toBe(
      "TvGMRGGNSw027OfCxUt400",
    )
  })

  it("drops whitespace pasted around the ID", () => {
    expect(muxPlaybackId("  TvGMRGGNSw027OfCxUt400\n")).toBe(
      "TvGMRGGNSw027OfCxUt400",
    )
  })

  it.each([null, undefined, "", "   "])("treats %j as no video", (value) => {
    expect(muxPlaybackId(value)).toBeNull()
  })
})

describe("muxThumbnailUrl", () => {
  it("points at Mux's image service for the playback ID", () => {
    expect(muxThumbnailUrl("TvGMRGGNSw027OfCxUt400")).toBe(
      "https://image.mux.com/TvGMRGGNSw027OfCxUt400/thumbnail.webp",
    )
  })
})

describe("videoPosterUrl", () => {
  it("uses the Prismic image when one is set", () => {
    expect(videoPosterUrl("TvGMRGGNSw027OfCxUt400", image)).toBe(image.url)
  })

  it("falls back to the Mux frame when the image is empty or missing", () => {
    const fallback =
      "https://image.mux.com/TvGMRGGNSw027OfCxUt400/thumbnail.webp"
    expect(videoPosterUrl("TvGMRGGNSw027OfCxUt400", {} as ImageField)).toBe(
      fallback,
    )
    expect(videoPosterUrl("TvGMRGGNSw027OfCxUt400", undefined)).toBe(fallback)
  })
})
