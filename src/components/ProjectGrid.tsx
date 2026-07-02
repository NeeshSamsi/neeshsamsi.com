"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "@heroicons/react/24/outline"
import { PrismicNextImage } from "@prismicio/next"
import { type Content } from "@prismicio/client"
import { cva } from "class-variance-authority"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

export type ProjectGridItemType = {
  id: Content.ProjectDocument["id"]
  link: string
} & Pick<
  Content.ProjectDocumentData,
  "image" | "hoverImage" | "title" | "subtitle"
>

interface ProjectGridProps {
  items: ProjectGridItemType[]
}

/* ────────────────────────────────────────────────────────────────────────
 * GRID ITEM REVEAL — tweak the per-item scroll reveal here.
 *   Each item, as it scrolls in, plays: container fades + rises while the
 *   image eases out of a slight zoom → subtitle rises in → title reveals
 *   line-by-line out of a mask. `subtitleAt`/`titleAt` are start times (s)
 *   within that per-item timeline. Items stagger naturally as you scroll
 *   because each item triggers on its own entry.
 * ──────────────────────────────────────────────────────────────────────── */
const REVEAL = {
  start: "top 85%", // image/container: fires when the item's top hits 85%
  textStart: "top 90%", // subtitle+title: their OWN trigger, so they reveal
  //                       as you actually scroll to them (not with the image)
  y: 24, // px the container / subtitle rise from
  imageScaleFrom: 1.02, // image starts here, eases to 1
  duration: 0.7,
  ease: "power3.out",
  subtitleAt: 0, // subtitle at the start of the text timeline
  titleAt: 0.15, // title lines come in just after the subtitle
  lineStagger: 0.1, // delay between title lines
  pairStagger: 0.15, // the 2nd item of each visible row-pair waits this long
} as const

type Layout = "wide-tall" | "tall-wide" | "wide-solo"

// Maps cycle index to layout variant
const CYCLE_LAYOUTS: Layout[] = [
  "wide-tall",
  "tall-wide",
  "tall-wide",
  "wide-tall",
  "wide-solo",
]

const gridItem = cva("col-span-1 self-start", {
  variants: {
    layout: {
      "wide-tall": "sm:col-span-7",
      "tall-wide": "sm:col-span-5",
      "wide-solo": "sm:col-start-4 sm:col-span-9",
    },
  },
})

const imageContainer = cva(
  // Base: 16/9 on mobile for all items.
  "bg-darker relative w-full overflow-hidden rounded-xl border-[0.5px] border-lighter/50 ring-[0.5px] ring-transparent ring-inset transition-shadow duration-500 group-hover:ring-lighter/50 aspect-video",
  {
    variants: {
      layout: {
        // At sm+, apply the proper per-layout ratio
        "wide-tall": "sm:aspect-[4/3]",
        "tall-wide": "sm:aspect-[3/4]",
        "wide-solo": "", // stays aspect-video at all sizes
      },
    },
  },
)

export default function ProjectGrid({ items }: ProjectGridProps) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return

      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splits: SplitText[] = []

        gsap.utils
          .toArray<HTMLElement>("[data-reveal-item]", el)
          .forEach((item, index) => {
            const imageBox =
              item.querySelector<HTMLElement>("[data-reveal-image]")
            const textBlock =
              item.querySelector<HTMLElement>("[data-reveal-text]")
            const subtitle = item.querySelector<HTMLElement>(
              "[data-reveal-subtitle]",
            )
            const title = item.querySelector<HTMLElement>("[data-reveal-title]")

            // Two items share a row and enter together, so the odd one of each
            // pair waits pairStagger to stagger them. (On mobile it's one
            // column, so this is just a tiny rhythm between consecutive items.)
            const pairDelay = (index % 2) * REVEAL.pairStagger

            // Container + image: reveal when the item (the image) enters.
            const tlImage = gsap.timeline({
              delay: pairDelay,
              scrollTrigger: { trigger: item, start: REVEAL.start, once: true },
            })
            tlImage.from(
              item,
              {
                opacity: 0,
                y: REVEAL.y,
                duration: REVEAL.duration,
                ease: REVEAL.ease,
              },
              0,
            )
            if (imageBox) {
              tlImage.from(
                imageBox,
                {
                  scale: REVEAL.imageScaleFrom,
                  duration: REVEAL.duration,
                  ease: REVEAL.ease,
                },
                0,
              )
            }

            // Subtitle + title: their OWN trigger (the text block), so they
            // reveal as you scroll down to them — not with the image above.
            if (!title) return
            const split = SplitText.create(title, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) => {
                const tlText = gsap.timeline({
                  delay: pairDelay,
                  scrollTrigger: {
                    trigger: textBlock ?? title,
                    start: REVEAL.textStart,
                    once: true,
                  },
                })

                if (subtitle) {
                  tlText.from(
                    subtitle,
                    {
                      opacity: 0,
                      y: REVEAL.y,
                      duration: REVEAL.duration,
                      ease: REVEAL.ease,
                    },
                    REVEAL.subtitleAt,
                  )
                }

                tlText.from(
                  self.lines,
                  {
                    yPercent: 100,
                    opacity: 0,
                    duration: REVEAL.duration,
                    ease: REVEAL.ease,
                    stagger: REVEAL.lineStagger,
                  },
                  REVEAL.titleAt,
                )

                return tlText
              },
            })

            splits.push(split)
          })

        return () => splits.forEach((s) => s.revert())
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="grid grid-cols-1 gap-y-8 sm:grid-cols-12 sm:gap-x-6 sm:gap-y-16"
    >
      {items.map((item, index) => {
        const layout = CYCLE_LAYOUTS[index % 5]

        const content = (
          <div className="group flex h-full w-full cursor-pointer flex-col">
            <div data-reveal-image className={imageContainer({ layout })}>
              <PrismicNextImage
                field={item.image}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />

              <PrismicNextImage
                field={item.hoverImage}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                fallbackAlt=""
                className="object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:opacity-100"
              />
            </div>

            <div
              data-reveal-text
              className="mt-4 flex flex-col items-start space-y-1 sm:mt-5 sm:space-y-2"
            >
              <p
                data-reveal-subtitle
                className="text-sm font-light text-lighter sm:text-base"
              >
                {item.subtitle}
              </p>
              <div className="flex items-center gap-2">
                <h3
                  data-reveal-title
                  className="font-serif text-xl leading-tight text-light sm:text-2xl xl:text-3xl"
                >
                  <span>{item.title}</span>
                  <span className="relative ml-1.5 inline-block h-5 w-5 translate-y-1 overflow-hidden align-baseline lg:h-6 lg:w-6">
                    <ArrowUpRightIcon className="h-5 w-5 stroke-2 text-light transition-transform duration-300 group-hover:-translate-y-full lg:h-6 lg:w-6" />
                    <ArrowUpRightIcon className="absolute inset-0 h-5 w-5 translate-y-full stroke-2 text-light transition-transform duration-300 group-hover:translate-y-0 lg:h-6 lg:w-6" />
                  </span>
                </h3>
              </div>
            </div>
          </div>
        )

        return (
          <div key={item.id} data-reveal-item className={gridItem({ layout })}>
            <Link href={item.link}>{content}</Link>
          </div>
        )
      })}
    </div>
  )
}
