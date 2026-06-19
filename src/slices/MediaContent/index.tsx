import { type JSX } from "react"
import {
  type Content,
  type ImageField,
  type LinkToMediaField,
  isFilled,
} from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { PrismicRichText } from "@prismicio/react"
import { PrismicNextImage } from "@prismicio/next"
import { cva } from "class-variance-authority"

import ImageWithPreview from "@/components/ImagePreview"
import PrismicVideo from "@/components/PrismicVideo"

export type MediaContentProps = SliceComponentProps<Content.MediaContentSlice>

// Returns the intrinsic aspect ratio of a Prismic image (its poster frame),
// used to size videos in "Original Dimensions" mode without layout shift.
function imageAspect(image: ImageField): string | undefined {
  if (!isFilled.image(image) || !image.dimensions) return undefined
  const { width, height } = image.dimensions
  return width && height ? `${width} / ${height}` : undefined
}

const singleImage = cva(
  "col-span-full block w-full max-w-full min-w-0 rounded-lg",
  {
    variants: {
      original: {
        true: "",
        false: "aspect-video object-cover",
      },
    },
  },
)

// Box wrapper for a single video (mirrors singleImage, but the box holds the
// <video> rather than being the image element itself).
const singleVideoBox = cva(
  "col-span-full block w-full max-w-full min-w-0 overflow-hidden rounded-lg",
  {
    variants: {
      original: {
        true: "",
        false: "aspect-video",
      },
    },
  },
)

const doubleRow =
  "col-span-full grid grid-cols-subgrid items-start gap-y-4 min-w-0 md:gap-y-0"

const doubleBox = cva("overflow-hidden rounded-lg min-w-0", {
  variants: {
    side: { left: "", right: "" },
    layout: {
      "Half & Half": "",
      "Wide Right": "",
      "Wide Left": "",
    },
    original: { true: "", false: "" },
  },
  compoundVariants: [
    // Widths: full-width on mobile, side+layout col-span at md+
    // (parent is a 12-col subgrid)
    {
      side: "left",
      layout: "Half & Half",
      class: "col-span-full md:col-span-6",
    },
    {
      side: "right",
      layout: "Half & Half",
      class: "col-span-full md:col-span-6",
    },
    {
      side: "left",
      layout: "Wide Right",
      class: "col-span-full md:col-span-4",
    },
    {
      side: "right",
      layout: "Wide Right",
      class: "col-span-full md:col-span-8",
    },
    {
      side: "left",
      layout: "Wide Left",
      class: "col-span-full md:col-span-8",
    },
    {
      side: "right",
      layout: "Wide Left",
      class: "col-span-full md:col-span-4",
    },
    // Aspect ratios (only when original dimensions is off):
    // - Half & Half -> both sides aspect-video
    // - Wide layouts -> narrow side aspect-square, wide side aspect-[4/3]
    { original: false, layout: "Half & Half", class: "aspect-video" },
    {
      original: false,
      layout: "Wide Right",
      side: "left",
      class: "aspect-square",
    },
    {
      original: false,
      layout: "Wide Right",
      side: "right",
      class: "aspect-video",
    },
    {
      original: false,
      layout: "Wide Left",
      side: "left",
      class: "aspect-video",
    },
    {
      original: false,
      layout: "Wide Left",
      side: "right",
      class: "aspect-square",
    },
  ],
})

const doubleImg = cva("block w-full max-w-full min-w-0", {
  variants: {
    original: {
      true: "",
      false: "h-full max-h-full object-cover",
    },
  },
})

// Renders one slot — a video if its Link-to-Media is filled (the image becomes
// the poster), otherwise the image. Used for both sides of DoubleMedia.
function DoubleSlot({
  image,
  video,
  original,
  side,
  layout,
}: {
  image: ImageField
  video: LinkToMediaField
  original: boolean
  side: "left" | "right"
  layout: Content.MediaContentSliceDoubleMedia["primary"]["layout"]
}): JSX.Element {
  return (
    <div className={doubleBox({ side, layout, original })}>
      {isFilled.linkToMedia(video) ? (
        <PrismicVideo
          field={video}
          poster={image}
          fill={!original}
          aspectRatio={original ? imageAspect(image) : undefined}
          wrapperClassName={original ? "w-full" : undefined}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageWithPreview
          field={image}
          sizes="50vw"
          wrapperClassName="block h-full w-full"
          className={doubleImg({ original })}
        />
      )}
    </div>
  )
}

const MediaContent = ({ slice }: MediaContentProps): JSX.Element => {
  const { description, originalDimensions } = slice.primary

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full mb-6 grid min-w-0 grid-cols-subgrid space-y-4 md:mb-8 md:space-y-6"
    >
      {slice.variation === "doubleMedia" ? (
        <div className={doubleRow}>
          <DoubleSlot
            image={slice.primary.image}
            video={slice.primary.video}
            original={originalDimensions}
            side="left"
            layout={slice.primary.layout}
          />
          <DoubleSlot
            image={slice.primary.image2}
            video={slice.primary.video2}
            original={originalDimensions}
            side="right"
            layout={slice.primary.layout}
          />
        </div>
      ) : isFilled.linkToMedia(slice.primary.video) ? (
        <PrismicVideo
          field={slice.primary.video}
          poster={slice.primary.image}
          fill={false}
          aspectRatio={
            originalDimensions ? imageAspect(slice.primary.image) : undefined
          }
          wrapperClassName={singleVideoBox({ original: originalDimensions })}
          className="h-full w-full object-cover"
        />
      ) : (
        <PrismicNextImage
          field={slice.primary.image}
          sizes="100vw"
          fallbackAlt=""
          className={singleImage({ original: originalDimensions })}
        />
      )}

      {description && (
        <div className="col-span-full prose max-w-none leading-snug font-light text-light prose-invert md:col-span-8">
          <PrismicRichText field={description} />
        </div>
      )}
    </section>
  )
}

export default MediaContent
