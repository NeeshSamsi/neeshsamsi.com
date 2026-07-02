"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ────────────────────────────────────────────────────────────────────────
 * BUTTON REVEAL — the container fades + rises (subtle, no mask), then the
 * label slides up out of its mask, staggered after the container (labelAt).
 * The label slide targets the transition-free [data-reveal-label] wrapper
 * inside <Button>, so the hover swap keeps working afterwards.
 * ──────────────────────────────────────────────────────────────────────── */
const BUTTON_REVEAL = {
  start: "top 90%",
  y: 16, // px the container rises from
  duration: 0.6,
  ease: "power3.out",
  labelAt: 0.2, // label masks in this long after the container starts
} as const

/** Wraps a single <Button> and reveals it on scroll. Renders display:contents
 *  so it doesn't disturb the surrounding layout. */
export default function RevealButton({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const container = el.firstElementChild as HTMLElement | null
      const label = el.querySelector<HTMLElement>("[data-reveal-label]")
      if (!container) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: BUTTON_REVEAL.start,
            once: true,
          },
        })

        tl.from(
          container,
          {
            opacity: 0,
            y: BUTTON_REVEAL.y,
            duration: BUTTON_REVEAL.duration,
            ease: BUTTON_REVEAL.ease,
          },
          0,
        )

        if (label) {
          tl.from(
            label,
            {
              yPercent: 100,
              duration: BUTTON_REVEAL.duration,
              ease: BUTTON_REVEAL.ease,
            },
            BUTTON_REVEAL.labelAt,
          )
        }

        return tl
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="contents">
      {children}
    </div>
  )
}
