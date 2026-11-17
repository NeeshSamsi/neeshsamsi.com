// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import type { ImageField } from "@prismicio/client"
import { afterEach, describe, expect, it, vi } from "vitest"

// The real player needs a browser media stack. Here it is a marker, so the
// test covers what `PrismicVideo` itself does: show the poster in the same
// box, then hand over to the player once its chunk has loaded.
vi.mock("./PrismicVideoPlayer", () => ({
  default: ({ playbackId }: { playbackId: string }) => (
    <div data-testid="player" data-playback-id={playbackId} />
  ),
}))

import PrismicVideo from "./PrismicVideo"

afterEach(cleanup)

const poster = {
  id: "poster",
  url: "https://images.prismic.io/neeshsamsi/poster.jpg",
  alt: null,
  copyright: null,
  dimensions: { width: 1080, height: 1920 },
  edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
} as ImageField

describe("PrismicVideo", () => {
  it("shows the poster in the sized box until the player has loaded", async () => {
    const { container } = render(
      <PrismicVideo
        playbackId="abc123"
        poster={poster}
        aspectRatio="1080 / 1920"
        wrapperClassName="rounded-lg"
      />,
    )

    const placeholder = container.querySelector("video")
    expect(placeholder).not.toBeNull()
    expect(placeholder?.getAttribute("poster")).toBe(poster.url)
    expect(placeholder?.hasAttribute("src")).toBe(false)
    const box = placeholder?.parentElement
    expect(box?.style.aspectRatio).toBe("1080 / 1920")
    expect(box?.className).toContain("rounded-lg")

    const player = await screen.findByTestId("player")
    expect(player.dataset.playbackId).toBe("abc123")
    expect(container.querySelector("video")).toBeNull()
  })

  it("uses Mux's frame as the poster when there is no image", () => {
    const { container } = render(<PrismicVideo playbackId="abc123" fill />)
    const placeholder = container.querySelector("video")
    expect(placeholder?.getAttribute("poster")).toBe(
      "https://image.mux.com/abc123/thumbnail.webp",
    )
    // `fill` hands sizing to the parent box.
    expect(placeholder?.parentElement?.className).toContain("h-full w-full")
    expect(placeholder?.parentElement?.style.aspectRatio).toBe("")
  })
})
