// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"

type Helpers = typeof import("./umami")

function tracker() {
  return {
    track: vi.fn(async () => {}),
    identify: vi.fn(async () => {}),
  }
}

/** What the browser does when a script finishes loading. */
function scriptLoads() {
  const script = document.createElement("script")
  document.head.append(script)
  script.dispatchEvent(new Event("load"))
}

describe("umami helpers", () => {
  let helpers: Helpers

  beforeEach(async () => {
    delete window.umami
    // `identify` keeps waiting data in module state.
    vi.resetModules()
    helpers = await import("./umami")
  })

  describe("track", () => {
    it("passes the event to the tracker", () => {
      const umami = tracker()
      window.umami = umami

      helpers.track("contact_open", { trigger: "keyboard" })
      helpers.track("contact_sent")

      expect(umami.track.mock.calls).toEqual([
        ["contact_open", { trigger: "keyboard" }],
        ["contact_sent", undefined],
      ])
    })

    it("does nothing when the tracker is missing", () => {
      expect(() => helpers.track("contact_open")).not.toThrow()
    })
  })

  describe("identify", () => {
    it("sends session data straight away when the tracker is there", () => {
      const umami = tracker()
      window.umami = umami

      helpers.identify({ reduced_motion: true })

      expect(umami.identify.mock.calls).toEqual([[{ reduced_motion: true }]])
    })

    it("holds data given before the tracker loaded and sends it once", () => {
      helpers.identify({ reduced_motion: false })
      helpers.identify({ reduced_motion: true })

      // Some other script: the tracker is still missing.
      scriptLoads()

      const umami = tracker()
      window.umami = umami
      scriptLoads()
      scriptLoads()

      expect(umami.identify.mock.calls).toEqual([[{ reduced_motion: true }]])
    })

    it("ignores load events from anything that is not a script", () => {
      helpers.identify({ reduced_motion: false })
      const umami = tracker()
      window.umami = umami

      const image = document.createElement("img")
      document.body.append(image)
      image.dispatchEvent(new Event("load"))

      expect(umami.identify).not.toHaveBeenCalled()
    })

    it("never sends when no tracker arrives", () => {
      expect(() => {
        helpers.identify({ reduced_motion: false })
        scriptLoads()
      }).not.toThrow()
    })
  })

  describe("eventAttributes", () => {
    it("turns an event into the tracker's data attributes", () => {
      expect(
        helpers.eventAttributes({
          name: "outbound_click",
          data: { kind: "social", target: "github" },
        }),
      ).toEqual({
        "data-umami-event": "outbound_click",
        "data-umami-event-kind": "social",
        "data-umami-event-target": "github",
      })
    })

    it("gives nothing for no event", () => {
      expect(helpers.eventAttributes(undefined)).toEqual({})
    })
  })

  describe("outboundEvent", () => {
    it("names the other site by hostname only", () => {
      expect(
        helpers.outboundEvent("callout", "https://example.com/a/b?c=d#e"),
      ).toEqual({
        name: "outbound_click",
        data: { kind: "callout", host: "example.com" },
      })
    })

    it.each(["/work", "mailto:someone@example.com", "tel:+100", "", null])(
      "gives nothing for %j",
      (url) => {
        expect(helpers.outboundEvent("inline", url)).toBeUndefined()
      },
    )
  })
})
