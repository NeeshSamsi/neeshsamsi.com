"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import GridWrapper from "@/components/GridWrapper"

export default function NavbarContainer({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false)
  const [hideOffset, setHideOffset] = useState(0)
  const navRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    let ticking = false
    function update() {
      const y = window.scrollY
      setScrolled(y > 0)

      const delta = y - lastScrollY.current
      const navHeight = navRef.current?.offsetHeight ?? 0

      if (y <= 0) {
        setHideOffset(0)
      } else {
        setHideOffset((prev) => Math.max(0, Math.min(navHeight, prev + delta)))
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
