// Helpers for Umami, the site's analytics (see "Analytics (Umami)" in
// AGENTS.md). The tracker script is loaded by src/components/Umami.tsx on the
// production deployment only, and visitors with an ad blocker never get it, so
// everything here is safe to call when `window.umami` is missing.

/** Values Umami accepts as event or session data. Never personal data. */
export type UmamiData = Record<string, string | number | boolean>

/** The part of the tracker's `window.umami` object this site uses. */
type UmamiTracker = {
  track: (name: string, data?: UmamiData) => Promise<void>
  identify: (data: UmamiData) => Promise<void>
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}

/**
 * Records a custom event. Does nothing when the tracker is missing. For client
 * components only; Server Components use `eventAttributes` or `Tracked`.
 */
export function track(name: string, data?: UmamiData): void {
  if (typeof window === "undefined") return
  void window.umami?.track(name, data)
}

// Session data that arrived before the tracker did.
let pendingSessionData: UmamiData | undefined

/**
 * Saves properties on the visitor's session (no ID, so the session stays
 * anonymous).
 *
 * The tracker loads after hydration, so a call from a layout effect usually
 * comes first. The data is then held until the tracker's script has loaded.
 * `load` events do not bubble, but a capturing listener on the document sees
 * the one from every script. Without a tracker (local, previews, ad blockers)
 * the data is never sent.
 */
export function identify(data: UmamiData): void {
  if (typeof window === "undefined") return
  if (window.umami) {
    void window.umami.identify(data)
    return
  }

  const alreadyWaiting = pendingSessionData !== undefined
  pendingSessionData = { ...pendingSessionData, ...data }
  if (alreadyWaiting) return

  const onLoad = (event: Event) => {
    if (!(event.target instanceof HTMLScriptElement) || !window.umami) return
    document.removeEventListener("load", onLoad, true)
    if (pendingSessionData) void window.umami.identify(pendingSessionData)
    pendingSessionData = undefined
  }
  document.addEventListener("load", onLoad, true)
}

/** An event the tracker records by itself when the element is clicked. */
export type UmamiEvent = {
  name: string
  /** Attribute values are always stored as strings. */
  data?: Record<string, string>
}

type EventAttributes = Record<`data-umami-event${string}`, string>

/**
 * The `data-umami-event` attributes for an event, to spread onto an element.
 * They need no client JavaScript, so they work in Server Components.
 *
 * Never spread them onto a link to a page on this site: the tracker cancels
 * the click on such an anchor and sets `location.href`, which turns the
 * client-side navigation into a full page load. Use `Tracked` inside the link.
 */
export function eventAttributes(
  event: UmamiEvent | undefined,
): EventAttributes {
  if (!event) return {}

  const attributes: EventAttributes = { "data-umami-event": event.name }
  for (const [key, value] of Object.entries(event.data ?? {})) {
    attributes[`data-umami-event-${key}`] = value
  }
  return attributes
}

/**
 * The `outbound_click` event for a link to another site, or undefined when the
 * URL is not an http(s) one (a page on this site, `mailto:`, `tel:`).
 */
export function outboundEvent(
  kind: "callout" | "inline",
  url: string | null | undefined,
): UmamiEvent | undefined {
  if (!url) return undefined
  try {
    const { protocol, hostname } = new URL(url)
    if (protocol !== "http:" && protocol !== "https:") return undefined
    return { name: "outbound_click", data: { kind, host: hostname } }
  } catch {
    return undefined
  }
}
