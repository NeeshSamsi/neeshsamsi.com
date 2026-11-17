"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { setLenis } from "@/lib/lenis"
import { identify } from "@/lib/umami"

gsap.registerPlugin(ScrollTrigger)

const lenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

// Creates the smooth-scroll instance and wires it to GSAP. Returns its teardown.
function startLenis() {
  const lenis = new Lenis(lenisOptions)
  setLenis(lenis)

  // Forward Lenis scroll events to ScrollTrigger so triggers
  // recompute on every smooth-scroll tick.
  lenis.on("scroll", ScrollTrigger.update)

  // Drive Lenis from GSAP's ticker so both share one RAF loop.
  // gsap.ticker.add passes time in seconds; Lenis.raf expects ms.
  const update = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(update)

  // GSAP throttles its own ticker after long frames; turning that
  // off keeps Lenis + ScrollTrigger in sync after tab switches.
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(update)
    lenis.off("scroll", ScrollTrigger.update)
    lenis.destroy()
    setLenis(null)
  }
}

export default function LenisProvider() {
  useEffect(() => {
    // Smooth scrolling is animation: visitors who ask for reduced motion get
    // the browser's native scrolling. The preference can change while the page
    // is open, so Lenis is started and stopped to follow it.
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    let stop: (() => void) | undefined

    const sync = () => {
      stop?.()
      stop = reducedMotion.matches ? undefined : startLenis()
    }

    sync()
    // Analytics: how many visitors see the site without its animations.
    identify({ reduced_motion: reducedMotion.matches })
    reducedMotion.addEventListener("change", sync)
    return () => {
      reducedMotion.removeEventListener("change", sync)
      stop?.()
    }
  }, [])

  return null
}
