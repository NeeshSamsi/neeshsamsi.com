import { type JSX } from "react"
import {
  type Content,
  type ImageField,
  type LinkToMediaField,
  asText,
  isFilled,
} from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { PrismicNextImage } from "@prismicio/next"
import { cva } from "class-variance-authority"

import ImageWithPreview from "@/components/ImagePreview"
import PrismicVideo from "@/components/PrismicVideo"
import ProseRichText from "@/components/ProseRichText"
import { cn } from "@/lib/utils"

export type MediaContentProps = SliceComponentProps<Content.MediaContentSlice>

// Returns the intrinsic aspect ratio of a Prismic image (its poster frame),
// used to size videos in "Original Dimensions" mode without layout shift.
function imageAspect(image: ImageField): string | undefined {
  if (!isFilled.image(image) || !image.dimensions) return undefined
  const { width, height } = image.dimensions
  return width && height ? `${width} / ${height}` : undefined
}

// Width options mirror the "Layout Type" pattern from the doubleMedia
// variation: full-width on mobile, fraction of the 12-col grid at md+.
// md:col-start-1 forces its own row regardless of span — otherwise grid
// auto-placement packs a narrow box (e.g. One Third) into whatever columns
// the title left over in the same row.
const singleWidth = {
  Full: "col-span-full md:col-start-1",
  "One Third": "col-span-full md:col-span-4 md:col-start-1",
  Half: "col-span-full md:col-span-6 md:col-start-1",
  "Two Third": "col-span-full md:col-span-8 md:col-start-1",
}

const singleImage = cva("block w-full max-w-full min-w-0 rounded-lg", {
  variants: {
    original: {
      true: "",
      false: "aspect-video object-cover",
    },
    width: singleWidth,
  },
  defaultVariants: {
    width: "Full",
  },
})

// Box wrapper for a single video (mirrors singleImage, but the box holds the
// <video> rather than being the image element itself).
const singleVideoBox = cva("overflow-hidden rounded-lg min-w-0", {
  variants: {
    original: {
      true: "",
      false: "aspect-video",
    },
    width: singleWidth,
  },
  defaultVariants: {
    width: "Full",
  },
})

const doubleRow =
  "col-span-full grid grid-cols-subgrid items-start gap-y-4 min-w-0 md:gap-y-0"

type DoubleLayout = Content.MediaContentSliceDoubleMedia["primary"]["layout"]
type Side = "left" | "right"

// Per layout and side: the column span at md+ (the parent is a 12-col
// subgrid; every box is full-width on mobile) and the aspect ratio applied
// when "Original Dimensions" is off. Half & Half crops both sides to 16:9;
// the wide layouts pair a square narrow side with a 16:9 wide side.
const DOUBLE_LAYOUT: Record<
  DoubleLayout,
  Record<Side, { span: string; aspect: string }>
> = {
  "Half & Half": {
    left: { span: "md:col-span-6", aspect: "aspect-video" },
    right: { span: "md:col-span-6", aspect: "aspect-video" },
  },
  "Wide Right": {
    left: { span: "md:col-span-4", aspect: "aspect-square" },
    right: { span: "md:col-span-8", aspect: "aspect-video" },
  },
  "Wide Left": {
    left: { span: "md:col-span-8", aspect: "aspect-video" },
    right: { span: "md:col-span-4", aspect: "aspect-square" },
  },
}

function doubleBox({
  side,
  layout,
  original,
}: {
  side: Side
  layout: DoubleLayout
  original: boolean
}) {
  const { span, aspect } = DOUBLE_LAYOUT[layout][side]
  return cn(
    "min-w-0 overflow-hidden rounded-lg col-span-full",
    span,
    !original && aspect,
  )
}

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
  side: Side
  layout: DoubleLayout
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
  const { title, description, originalDimensions } = slice.primary

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full mb-6 grid min-w-0 grid-cols-subgrid space-y-4 md:mb-8 md:space-y-6"
    >
      {isFilled.richText(title) && (
        // Mirrors the section titles in ProjectOverview / TextContent.
        <h2 className="col-span-full font-serif text-2xl font-normal md:col-span-8">
          {asText(title)}
        </h2>
      )}

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
          wrapperClassName={singleVideoBox({
            original: originalDimensions,
            width: slice.primary.width || "Full",
          })}
          className="h-full w-full object-cover"
        />
      ) : (
        <PrismicNextImage
          field={slice.primary.image}
          sizes="100vw"
          fallbackAlt=""
          className={singleImage({
            original: originalDimensions,
            width: slice.primary.width || "Full",
          })}
        />
      )}

      {isFilled.richText(description) && (
        <ProseRichText
          field={description}
          className="col-span-full md:col-span-8 md:col-start-1"
        />
      )}
    </section>
  )
}

export default MediaContent
