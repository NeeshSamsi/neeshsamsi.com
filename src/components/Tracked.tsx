import { type ReactNode } from "react"

import { eventAttributes, type UmamiEvent } from "@/lib/umami"

/**
 * Records an Umami event when anything inside it is clicked. It goes INSIDE a
 * link to a page on this site, around the link's children, so the anchor
 * itself carries no `data-umami-event` and next/link still navigates
 * client-side (see "Analytics (Umami)" in AGENTS.md).
 *
 * `display: contents` keeps the wrapper out of the layout. Two limits follow
 * from that: a click on the link's own padding, and a link followed from the
 * keyboard, land on the anchor and are not counted. Give the padding to an
 * element inside the wrapper where that matters (as `Button` does).
 */
export default function Tracked({
  event,
  children,
}: {
  event: UmamiEvent | undefined
  children: ReactNode
}) {
  if (!event) return <>{children}</>

  return (
    <span className="contents" {...eventAttributes(event)}>
      {children}
    </span>
  )
}
