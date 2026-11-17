import { type JSX } from "react"
import { type RichTextField } from "@prismicio/client"
import { type JSXMapSerializer, PrismicRichText } from "@prismicio/react"
import { PrismicNextLink } from "@prismicio/next"
import clsx from "clsx"

import { eventAttributes, outboundEvent } from "@/lib/umami"

// Links to other sites and to files open in a new tab, whatever the editor's
// "open in new tab" setting, so a reader never loses their place in a case
// study. Links to documents on this site stay in the tab and navigate
// client-side through next/link.
//
// A link to another site also records Umami's `outbound_click` (kind "inline",
// with the link's hostname). Links to pages here carry no event attributes,
// which would break their client-side navigation.
export const proseHyperlink: NonNullable<JSXMapSerializer["hyperlink"]> = ({
  node,
  children,
}) =>
  node.data.link_type === "Document" ? (
    <PrismicNextLink field={node.data}>{children}</PrismicNextLink>
  ) : (
    <PrismicNextLink
      field={node.data}
      target="_blank"
      rel="noopener noreferrer"
      {...eventAttributes(outboundEvent("inline", node.data.url))}
    >
      {children}
    </PrismicNextLink>
  )

/**
 * The serializers behind `ProseRichText`, for a `PrismicRichText` that needs
 * the same link behaviour without the prose wrapper.
 */
export const proseComponents: JSXMapSerializer = { hyperlink: proseHyperlink }

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
        "prose max-w-none leading-relaxed font-light text-light prose-invert marker:text-brand prose-a:font-light prose-a:text-light prose-a:transition-colors prose-a:hover:text-brand prose-strong:text-light",
        className,
      )}
    >
      <PrismicRichText field={field} components={proseComponents} />
    </div>
  )
}
