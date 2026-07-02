"use client"

import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"

/* ────────────────────────────────────────────────────────────────────────
 * INTRO SETTINGS — tweak everything here.
 *
 * Each group has an `at`: the start time (in seconds) on the shared timeline,
 * so you can slide whole groups earlier/later relative to one another.
 *   • navbar + card both start at 0 → they play in parallel
 *   • titles start a little later → staggered "off" the main card fade
 *   • contact starts last → it always finishes the sequence
 *
 * `duration`, `ease`, `stagger` and the travel distances are per-group too.
 * Eases: try "power2.out", "power4.out", "expo.out", "back.out(1.6)".
 * ──────────────────────────────────────────────────────────────────────── */
const INTRO = {
  /** Pause (s) before the very first element moves. */
  startDelay: 0.15,

  /** Featured project card — the "main" animation: fades in while rising up,
   *  and its image eases from a slight zoom (scaleFrom) back to 1. */
  card: {
    at: 0,
    distance: 24, // px it rises from
    scaleFrom: 1.05, // image starts at this scale, animates to 1
    duration: 0.9,
    ease: "power3.out",
  },

  /** Navbar items — masked, slide DOWN into view from above. Parallel with the card. */
  navbar: {
    at: 0,
    distance: 100, // % of its own height it travels (100 = a full reveal)
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.08,
  },

  /** Featured title + ping-dot — masked, slide UP from below. Staggered after the card. */
  titles: {
    at: 0.45,
    distance: 100,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.14,
  },

  /** Contact CTA — the whole pill fades + rises subtly (no mask); then its
   *  label text masks in, staggered. Always ends last. */
  contact: {
    at: 0.95,
    distance: 24, // px the pill rises from
    textDelay: 0.2, // label masks in this long after the pill appears
    duration: 0.7,
    ease: "power3.out",
  },
} as const

// Pre-hide the animated bits in the server HTML so there's no flash of the
// finished layout before GSAP takes over on the client. Gated behind
// no-preference so reduce-motion users just see the content immediately.
const PREHIDE_CSS = `
@media (prefers-reduced-motion: no-preference) {
  [data-intro="card"],
  [data-intro="navbar"] > *,
  [data-intro="titles"] > *,
  [data-intro="contact"] > * { opacity: 0; }
}`

// Mask groups clip their single child during the reveal. We grab that child
// as the actual tween target so the wrapper can stay put and do the clipping.
function maskInners(group: string) {
  return gsap.utils
    .toArray<HTMLElement>(`[data-intro="${group}"]`)
    .map((wrap) => wrap.firstElementChild)
    .filter((el): el is HTMLElement => el instanceof HTMLElement)
}

export default function HomeIntro() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-intro="card"]')
      const cardImages = gsap.utils.toArray<HTMLElement>(
        '[data-intro="cardImage"]',
      )
      const navItems = maskInners("navbar")
      const titleItems = maskInners("titles")
      const contactItems = maskInners("contact") // the pill container
      const contactText = maskInners("contactMask") // the label slide wrapper

      // Clip the mask wrappers for the reveal, then re-open them so hover
      // effects, the ping ripple and the expanding contact form aren't left
      // clipped once the intro is done. The contact PILL is no longer masked
      // (it just fades + rises) — only its label text is.
      const masks = gsap.utils.toArray<HTMLElement>(
        '[data-intro="navbar"], [data-intro="titles"], [data-intro="contactMask"]',
      )
      gsap.set(masks, { overflow: "hidden" })

      const tl = gsap.timeline({
        delay: INTRO.startDelay,
        onComplete: () => gsap.set(masks, { overflow: "" }),
      })

      // fromTo (not from): the elements are pre-hidden via CSS (opacity: 0),
      // so `from` would read 0 as the *destination* and animate 0 → 0. The
      // explicit `to` opacity/offset is the visible end state.
      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: INTRO.card.distance },
          {
            opacity: 1,
            y: 0,
            duration: INTRO.card.duration,
            ease: INTRO.card.ease,
          },
          INTRO.card.at,
        )
      }

      // Image eases out of a slight zoom alongside the card fade. Scales the
      // image wrapper, not the <img> — so the hover zoom (on the <img>) still
      // works afterwards without a leftover inline transform fighting it.
      if (cardImages.length) {
        tl.fromTo(
          cardImages,
          { scale: INTRO.card.scaleFrom },
          {
            scale: 1,
            duration: INTRO.card.duration,
            ease: INTRO.card.ease,
          },
          INTRO.card.at,
        )
      }

      if (navItems.length) {
        tl.fromTo(
          navItems,
          { opacity: 0, yPercent: -INTRO.navbar.distance },
          {
            opacity: 1,
            yPercent: 0,
            duration: INTRO.navbar.duration,
            ease: INTRO.navbar.ease,
            stagger: INTRO.navbar.stagger,
          },
          INTRO.navbar.at,
        )
      }

      if (titleItems.length) {
        tl.fromTo(
          titleItems,
          { opacity: 0, yPercent: INTRO.titles.distance },
          {
            opacity: 1,
            yPercent: 0,
            duration: INTRO.titles.duration,
            ease: INTRO.titles.ease,
            stagger: INTRO.titles.stagger,
          },
          INTRO.titles.at,
        )
      }

      // Contact pill: subtle fade + rise (no mask).
      if (contactItems.length) {
        tl.fromTo(
          contactItems,
          { opacity: 0, y: INTRO.contact.distance },
          {
            opacity: 1,
            y: 0,
            duration: INTRO.contact.duration,
            ease: INTRO.contact.ease,
          },
          INTRO.contact.at,
        )
      }

      // Contact label: masks up into view, staggered after the pill appears.
      if (contactText.length) {
        tl.from(
          contactText,
          {
            yPercent: 100,
            duration: INTRO.contact.duration,
            ease: INTRO.contact.ease,
          },
          INTRO.contact.at + INTRO.contact.textDelay,
        )
      }
    })
  }, [])

  return <style dangerouslySetInnerHTML={{ __html: PREHIDE_CSS }} />
}
