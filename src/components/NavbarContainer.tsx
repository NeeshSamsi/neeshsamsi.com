"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import GridWrapper from "@/components/GridWrapper"

// Scroll settings — tune how much the user must scroll in each direction
// before the nav starts moving. Both values are in pixels.
const SCROLL_DOWN_TO_HIDE_PX = 120 // scroll down this far before the nav begins disappearing
const SCROLL_UP_TO_SHOW_PX = 60 // scroll up this far before the nav begins reappearing

// How much of the active-direction scroll tally counts toward moving the nav.
// Returns a positive number when past the down-threshold, negative when past
// the up-threshold, and 0 while inside the deadband.
function distancePastThreshold(accum: number): number {
  if (accum > SCROLL_DOWN_TO_HIDE_PX) return accum - SCROLL_DOWN_TO_HIDE_PX
  if (accum < -SCROLL_UP_TO_SHOW_PX) return accum + SCROLL_UP_TO_SHOW_PX
  return 0
}

export default function NavbarContainer({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [hideOffset, setHideOffset] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)
  // Signed tally of scroll in the current direction streak. Resets to 0
  // whenever scroll direction flips, so each new direction has to clear its
  // own threshold before the nav moves.
  const directionAccum = useRef(0)

  useEffect(() => {
    let ticking = false
    function update() {
      const y = window.scrollY
      setScrolled(y > 0)

      const delta = y - lastScrollY.current
      const navHeight = navRef.current?.offsetHeight ?? 0

      if (y <= 0) {
        setHideOffset(0)
        directionAccum.current = 0
        lastScrollY.current = y
        ticking = false
        return
      }

      if (delta !== 0) {
        // Reset the direction tally when the scroll flips sign.
        if (
          (delta > 0 && directionAccum.current < 0) ||
          (delta < 0 && directionAccum.current > 0)
        ) {
          directionAccum.current = 0
        }

        const pastBefore = distancePastThreshold(directionAccum.current)
        directionAccum.current += delta
        const pastNow = distancePastThreshold(directionAccum.current)

        const moveDelta = pastNow - pastBefore
        if (moveDelta !== 0) {
          setHideOffset((prev) =>
            Math.max(0, Math.min(navHeight, prev + moveDelta)),
          )
        }
      }

      lastScrollY.current = y
      ticking = false
    }
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    // Sync initial state (e.g. when navigating back to a scrolled page).
    // Routed through rAF so setState stays out of the effect body.
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-0 z-40 w-full border-b-[0.5px] border-transparent transition-[color,background-color,border-color,backdrop-filter] duration-300 ease-out",
        scrolled && "border-lighter/50 bg-dark/30 backdrop-blur-sm",
      )}
      style={{ transform: `translateY(-${hideOffset}px)` }}
    >
      <GridWrapper className="flex flex-col items-center justify-between gap-4 py-2 text-sm sm:flex-row sm:gap-0 sm:py-4 md:text-base">
        {children}
      </GridWrapper>
    </nav>
  )
}
