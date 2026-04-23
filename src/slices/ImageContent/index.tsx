import { type JSX } from "react"
import { type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { PrismicRichText } from "@prismicio/react"
import { PrismicNextImage } from "@prismicio/next"
import { cva } from "class-variance-authority"

export type ImageContentProps = SliceComponentProps<Content.ImageContentSlice>

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

const ImageContent = ({ slice }: ImageContentProps): JSX.Element => {
  const { image, description, originalDimensions } = slice.primary

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full mb-6 grid min-w-0 grid-cols-subgrid space-y-4 md:mb-8 md:space-y-6"
    >
      {slice.variation === "doubleImage" ? (
        <div className={doubleRow}>
          <div
            className={doubleBox({
              side: "left",
              layout: slice.primary.layout,
              original: originalDimensions,
            })}
          >
            <PrismicNextImage
              field={image}
              sizes="50vw"
              className={doubleImg({ original: originalDimensions })}
            />
          </div>
          <div
            className={doubleBox({
              side: "right",
              layout: slice.primary.layout,
              original: originalDimensions,
            })}
          >
            <PrismicNextImage
              field={slice.primary.image2}
              sizes="50vw"
              className={doubleImg({ original: originalDimensions })}
            />
          </div>
        </div>
      ) : (
        <PrismicNextImage
          field={image}
          sizes="100vw"
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

export default ImageContent
