import Link from "next/link"
import { ArrowUpRightIcon } from "@heroicons/react/24/outline"
import { PrismicNextImage } from "@prismicio/next"
import { type Content } from "@prismicio/client"
import { cva } from "class-variance-authority"

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
  // Base: 16/9 on mobile for all items
  "bg-darker relative w-full overflow-hidden rounded-xl border-[0.5px] border-lighter/50 aspect-video",
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
  return (
    <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-12 sm:gap-x-6 sm:gap-y-16">
      {items.map((item, index) => {
        const layout = CYCLE_LAYOUTS[index % 5]

        const content = (
          <div className="group flex h-full w-full cursor-pointer flex-col">
            <div className={imageContainer({ layout })}>
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

            <div className="mt-4 flex flex-col items-start space-y-1 sm:mt-5 sm:space-y-2">
              <p className="text-sm font-light text-lighter sm:text-base">
                {item.subtitle}
              </p>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl leading-tight text-light sm:text-2xl xl:text-3xl">
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
          <div key={item.id} className={gridItem({ layout })}>
            <Link href={item.link}>{content}</Link>
          </div>
        )
      })}
    </div>
  )
}
