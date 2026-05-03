"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import { setLenis } from "@/lib/lenis"

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

export default function LenisProvider() {
  useEffect(() => {
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
  }, [])

  return null
}
