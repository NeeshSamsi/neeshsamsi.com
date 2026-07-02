import { FC } from "react"
import { Content, isFilled } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"
import PingDot from "@/components/PingDot"

/**
 * Props for `FeaturedProject`.
 */
export type FeaturedProjectProps =
  SliceComponentProps<Content.FeaturedProjectSlice>

/**
 * Component for "FeaturedProject" Slices.
 */
const FeaturedProject: FC<FeaturedProjectProps> = ({ slice }) => {
  const { featuredProject } = slice.primary

  // Safely extract the linked document's populated fields using isFilled utility
  const projectData = isFilled.contentRelationship(featuredProject)
    ? featuredProject.data
    : null

  if (!projectData) return null

  const { image, title, type } = projectData

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full my-4 grid grid-cols-subgrid md:my-8"
    >
      <PrismicNextLink
        field={featuredProject}
        data-intro="card"
        className="group/featureImage relative col-span-full flex aspect-video w-full flex-col justify-end overflow-hidden rounded-lg border-[0.5px] border-lighter/50 ring-[0.5px] ring-transparent ring-inset transition-shadow duration-500 hover:ring-lighter/50"
      >
        <div data-intro="cardImage" className="absolute inset-0 -z-10">
          <PrismicNextImage
            field={image}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover/featureImage:scale-102"
            preload
          />
        </div>

        {/* Gradient */}
        <div
          className="absolute inset-0 -z-10 bg-linear-to-t from-dark/95 via-dark/30 to-transparent"
          aria-hidden="true"
        />

        {/* Content. Each item is wrapped in a mask group whose single child
            is slid up from below by the intro (see HomeIntro). */}
        <div className="flex w-full flex-col-reverse items-start justify-between gap-1 p-3 sm:gap-2 sm:px-6 sm:py-4 md:flex-row md:items-end md:gap-8">
          <div data-intro="titles">
            <h1 className="font-serif text-xl font-normal xs:text-2xl md:text-3xl">
              {title}
            </h1>
          </div>
          <div data-intro="titles">
            <div className="flex items-center gap-2 text-sm font-light md:gap-3 md:text-lg">
              <PingDot className="size-1.5 md:size-2" />
              <span>{type}</span>
            </div>
          </div>
        </div>
      </PrismicNextLink>
    </section>
  )
}

export default FeaturedProject
