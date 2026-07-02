"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

/* ────────────────────────────────────────────────────────────────────────
 * FOOTER REVEAL — on scroll: the big email masks in line-by-line
 * (hello@ → neeshsamsi.com), and both link columns stagger in just after.
 *   emailStagger — gap between the two email lines.
 *   linksAt      — when the links start, relative to the email (slight delay).
 *   linkStagger  — gap between individual links (across both columns).
 * Links animate at the <li> level so each NavLink's hover swap is untouched.
 * ──────────────────────────────────────────────────────────────────────── */
const FOOTER = {
  start: "top 85%",
  duration: 0.7,
  ease: "power3.out",
  emailStagger: 0.12,
  linkY: 12, // px links rise from
  linkStagger: 0.06,
  linksAt: 0.1, // links start this long after the email
} as const

export default function FooterReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const trigger = el.firstElementChild as HTMLElement | null
      const emailLines = gsap.utils.toArray<HTMLElement>(
        "[data-footer-email]",
        el,
      )
      // Titles lead the stagger, then the links follow.
      const links = [
        ...gsap.utils.toArray<HTMLElement>("[data-footer-title]", el),
        ...gsap.utils.toArray<HTMLElement>("[data-footer-link]", el),
      ]
      if (!trigger) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split =
          emailLines.length > 0
            ? SplitText.create(emailLines, {
                type: "lines",
                mask: "lines",
                autoSplit: true,
                onSplit: (self) => buildTimeline(self.lines),
              })
            : buildTimeline([])

        function buildTimeline(lines: Element[]) {
          const tl = gsap.timeline({
            scrollTrigger: { trigger, start: FOOTER.start, once: true },
          })

          if (lines.length) {
            tl.from(
              lines,
              {
                yPercent: 100,
                opacity: 0,
                duration: FOOTER.duration,
                ease: FOOTER.ease,
                stagger: FOOTER.emailStagger,
              },
              0,
            )
          }

          if (links.length) {
            tl.from(
              links,
              {
                opacity: 0,
                y: FOOTER.linkY,
                duration: FOOTER.duration,
                ease: FOOTER.ease,
                stagger: FOOTER.linkStagger,
              },
              FOOTER.linksAt,
            )
          }

          return tl
        }

        return () => {
          if (split instanceof SplitText) split.revert()
        }
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
