// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import type { Content, ImageField } from "@prismicio/client"
import { afterEach, describe, expect, it, vi } from "vitest"

// The player, image optimisation and the lightbox are not under test: each is
// replaced by a marker that records what the slice asked it to show.
vi.mock("@/components/PrismicVideo", () => ({
  default: ({
    playbackId,
    poster,
  }: {
    playbackId: string
    poster?: ImageField
  }) => (
    <div
      data-testid="video"
      data-playback-id={playbackId}
      data-poster={poster?.url ?? ""}
    />
  ),
}))
vi.mock("@prismicio/next", () => ({
  PrismicNextImage: ({ field }: { field: ImageField }) => (
    <div data-testid="image" data-url={field.url ?? ""} />
  ),
}))
vi.mock("@/components/ImagePreview", () => ({
  default: ({ field }: { field: ImageField }) => (
    <div data-testid="image" data-url={field.url ?? ""} />
  ),
}))

import MediaContent from "./index"

afterEach(cleanup)

const image = (name: string) =>
  ({
    id: name,
    url: `https://images.prismic.io/neeshsamsi/${name}.jpg`,
    alt: null,
    copyright: null,
    dimensions: { width: 1600, height: 900 },
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  }) as ImageField

function renderSlice(variation: string, primary: Record<string, unknown>) {
  const slice = {
    id: "media_content$test",
    slice_type: "media_content",
    slice_label: null,
    variation,
    version: "initial",
    items: [],
    primary: {
      title: [],
      description: [],
      originalDimensions: true,
      ...primary,
    },
  } as unknown as Content.MediaContentSlice
  render(<MediaContent slice={slice} index={0} slices={[slice]} context={{}} />)
  return {
    videos: screen.queryAllByTestId("video"),
    images: screen.queryAllByTestId("image"),
  }
}

describe("MediaContent, single", () => {
  it("plays the Mux clip, with the image as poster, when a playback ID is set", () => {
    const { videos, images } = renderSlice("default", {
      image: image("poster"),
      muxPlaybackId: "abc123",
      width: "Full",
    })
    expect(images).toHaveLength(0)
    expect(videos).toHaveLength(1)
    expect(videos[0].dataset.playbackId).toBe("abc123")
    expect(videos[0].dataset.poster).toBe(image("poster").url)
  })

  it("shows the image when there is no playback ID", () => {
    const { videos, images } = renderSlice("default", {
      image: image("still"),
      muxPlaybackId: null,
      width: "Full",
    })
    expect(videos).toHaveLength(0)
    expect(images).toHaveLength(1)
    expect(images[0].dataset.url).toBe(image("still").url)
  })
})

describe("MediaContent, double", () => {
  it("decides each side from its own playback ID", () => {
    const { videos, images } = renderSlice("doubleMedia", {
      layout: "Half & Half",
      image: image("left"),
      muxPlaybackId: null,
      image2: image("right"),
      muxPlaybackId2: "right-id",
    })
    expect(images).toHaveLength(1)
    expect(images[0].dataset.url).toBe(image("left").url)
    expect(videos).toHaveLength(1)
    expect(videos[0].dataset.playbackId).toBe("right-id")
    expect(videos[0].dataset.poster).toBe(image("right").url)
  })

  it("plays both sides when both have a playback ID", () => {
    const { videos, images } = renderSlice("doubleMedia", {
      layout: "Wide Left",
      image: image("left"),
      muxPlaybackId: "left-id",
      image2: image("right"),
      muxPlaybackId2: "right-id",
    })
    expect(images).toHaveLength(0)
    expect(videos.map((video) => video.dataset.playbackId)).toEqual([
      "left-id",
      "right-id",
    ])
  })
})
