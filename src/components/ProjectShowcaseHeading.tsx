"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

import PingDot from "@/components/PingDot"

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ────────────────────────────────────────────────────────────────────────
 * SHOWCASE HEADING REVEAL — tweak here.
 *   On scroll-in: the heading reveals line-by-line out of a mask, then the
 *   ping-dot / category follows. `pingAt` is a timeline position relative to
 *   the end of the title lines ("-=0.25" = start 0.25s before they finish).
 *   `start` uses "top bottom" so a heading peeking below the fold reveals
 *   before you scroll (same as the featured title); a heading a screen down
 *   still waits for the scroll.
 * ──────────────────────────────────────────────────────────────────────── */
const HEADING = {
  start: "top bottom",
  yPercent: 100, // each line starts a full line below its mask
  duration: 0.7,
  ease: "power3.out",
  lineStagger: 0.12,
  pingFrom: 12, // px the ping-dot block rises from
  pingAt: "-=0.25", // when the ping-dot starts, relative to the title finishing
} as const

type ProjectShowcaseHeadingProps = {
  heading: string
  category: string
  /** Standalone pages render an h1; inline sections render an h2. */
  isStandalone: boolean
}

export default function ProjectShowcaseHeading({
  heading,
  category,
  isStandalone,
}: ProjectShowcaseHeadingProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const title = el.querySelector<HTMLElement>("[data-reveal-title]")
      const ping = el.querySelector<HTMLElement>("[data-reveal-ping]")
      if (!title) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: HEADING.start, once: true },
            })

            tl.from(self.lines, {
              yPercent: HEADING.yPercent,
              opacity: 0,
              duration: HEADING.duration,
              ease: HEADING.ease,
              stagger: HEADING.lineStagger,
            })

            if (ping) {
              tl.from(
                ping,
                {
                  opacity: 0,
                  y: HEADING.pingFrom,
                  duration: HEADING.duration,
                  ease: HEADING.ease,
                },
                HEADING.pingAt,
              )
            }

            return tl
          },
        })

        return () => split.revert()
      })
    },
    { scope: root },
  )

  const Tag = isStandalone ? "h1" : "h2"

  return (
    <div
      ref={root}
      className="flex flex-col-reverse items-start justify-between gap-2 sm:flex-row sm:items-end sm:gap-8"
    >
      <Tag
        data-reveal-title
        className="w-full font-serif text-2xl font-normal xs:text-3xl sm:w-[70%] sm:text-4xl xl:w-[60%]"
      >
        {heading}
      </Tag>
      <div
        data-reveal-ping
        className="flex shrink-0 items-center gap-2 pb-1 text-sm font-light sm:gap-3 sm:text-lg"
      >
        <PingDot className="size-1.5 sm:size-2" />
        <span>{category}</span>
      </div>
    </div>
  )
}
