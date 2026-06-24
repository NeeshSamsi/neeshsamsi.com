import { type JSX } from "react"
import { type RichTextField } from "@prismicio/client"
import { PrismicRichText } from "@prismicio/react"
import clsx from "clsx"

/**
 * Shared rich text content block used across slices (e.g. TextContent,
 * MediaContent descriptions). Centralises the prose typography plus link and
 * list-marker styling so both slices stay visually consistent and can be
 * restyled in one place.
 *
 * Links match the body text's colour and weight, keep their underline, and
 * transition to the accent colour on hover. List bullets/numbers use the
 * accent colour. Pass `className` for slice-specific layout (e.g. grid spans).
 */
export default function ProseRichText({
  field,
  className,
}: {
  field: RichTextField
  className?: string
}): JSX.Element {
  return (
    <div
      className={clsx(
        "prose max-w-none leading-relaxed font-light text-light prose-invert marker:text-brand prose-a:font-light prose-a:text-light prose-a:transition-colors prose-a:hover:text-brand",
        className,
      )}
    >
      <PrismicRichText field={field} />
    </div>
  )
}
