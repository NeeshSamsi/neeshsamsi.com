import { FC } from "react"
import { Content, asLink } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"
import { PrismicNextLink } from "@prismicio/next"
import { ExternalLink } from "lucide-react"

/**
 * Props for `ExternalLinkCallout`.
 */
export type ExternalLinkCalloutProps =
  SliceComponentProps<Content.ExternalLinkCalloutSlice>

/**
 * Component for "ExternalLinkCallout" Slices.
 */
const ExternalLinkCallout: FC<ExternalLinkCalloutProps> = ({ slice }) => {
  const { ctaText, link } = slice.primary

  const url = asLink(link)
  if (!url) return null

  // Use the editor-provided text if set; otherwise show a clean
  // hostname (strip protocol + trailing slash from the URL).
  const linkText = (link as { text?: string | null }).text
  const label = linkText || url.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full my-6 grid grid-cols-subgrid justify-items-end md:my-10"
    >
      <PrismicNextLink
        field={link}
        className="group relative col-span-full block w-fit overflow-hidden py-2 text-light transition-colors duration-500 ease-out hover:text-dark md:py-4"
      >
        {/* Foreground content sits above the animated background fill. */}
        <div className="relative z-10 flex flex-col px-4 md:px-4">
          {ctaText && (
            <p className="font-serif text-2xl leading-tight font-light">
              {ctaText}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 md:gap-4">
            <span className="text-5xl leading-none font-medium md:text-6xl lg:text-7xl">
              {label}
            </span>
            <ExternalLink
              aria-hidden
              className="size-10 md:size-12 lg:size-14"
            />
          </div>
        </div>

        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] bg-light transition-[height] duration-500 ease-out group-hover:h-full"
        />
      </PrismicNextLink>
    </section>
  )
}

export default ExternalLinkCallout
