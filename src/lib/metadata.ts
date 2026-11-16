import type { Metadata, ResolvingMetadata } from "next"

export type PageMetadataInput = {
  /** Site-relative path of the page ("/", "/work", "/projects/x"). */
  path: string
  /** Empty values are dropped so the root layout's defaults apply. */
  title?: string | null
  description?: string | null
  /** Absolute image URL for social cards. Falls back to the site-wide image. */
  image?: string | null
  type?: "website" | "article"
  card?: "summary" | "summary_large_image"
}

/**
 * Builds the metadata every routed page returns from `generateMetadata`.
 *
 * Next replaces nested objects (`openGraph`, `twitter`, `alternates`) wholesale
 * when a page defines them and inherits them untouched when it doesn't, so a
 * page that sets only some fields either loses the site defaults or keeps the
 * layout's values (the site-wide Twitter card, a canonical pointing at the
 * parent). Building all of them together, per page, avoids both.
 */
export async function buildPageMetadata(
  {
    path,
    title,
    description,
    image,
    type = "website",
    card = "summary",
  }: PageMetadataInput,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { openGraph: siteOpenGraph, twitter: siteTwitter } = await parent

  const pageTitle = title?.trim() || undefined
  const pageDescription = description?.trim() || undefined
  const images = image ? [{ url: image }] : siteOpenGraph?.images

  return {
    // Left out when empty: an explicit null/undefined-free object lets the
    // layout's default title and description show instead of none at all.
    ...(pageTitle && { title: pageTitle }),
    ...(pageDescription && { description: pageDescription }),
    alternates: { canonical: path },
    openGraph: {
      ...(pageTitle && { title: pageTitle }),
      ...(pageDescription && { description: pageDescription }),
      url: path,
      siteName: siteOpenGraph?.siteName,
      type,
      images,
    },
    twitter: {
      card,
      // Replacing `twitter` drops the layout's handle unless it is carried over.
      ...(siteTwitter?.creator && { creator: siteTwitter.creator }),
      ...(pageTitle && { title: pageTitle }),
      ...(pageDescription && { description: pageDescription }),
      images,
    },
  }
}

/** "client-work" -> "Client work". Title fallback for pages with no SEO title. */
export function humanizeUid(uid: string) {
  const words = uid.replace(/[-_]+/g, " ").trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}
