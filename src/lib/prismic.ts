import { cacheLife, cacheTag } from "next/cache"
import { notFound } from "next/navigation"
import { NotFoundError, type Content } from "@prismicio/client"
import { cacheTagPrismicPages, getPreviewRef } from "@prismicio/next"

import { createClient } from "@/prismicio"

// Every Prismic read on the site goes through this file, following Prismic's
// Cache Components setup: a "use cache" function that is kept until a webhook
// clears it, tagged with the IDs of the documents it returned (and the
// documents those link to). The preview ref is read outside the cache and
// passed in, so draft content is cached apart from published content.

/**
 * Shared tag on every list query. Per-document tags only reach lists that
 * already hold a changed document, so a newly published document would never
 * appear in them; the webhook clears this tag on every publish.
 */
export const PRISMIC_LISTS_TAG = "prismic-lists"

type UIDDocumentType = Exclude<Content.AllDocumentTypes["type"], "settings">
type ListParams = Parameters<ReturnType<typeof createClient>["getAllByType"]>[1]

async function fetchByUID<TType extends UIDDocumentType>(
  type: TType,
  uid: string,
  ref?: string,
) {
  "use cache"
  cacheLife("max")
  const page = await createClient()
    .getByUID(type, uid, { ref })
    .catch((error: unknown) => {
      // Only a missing document is a 404. A network error, an API outage or a
      // rate limit is rethrown, so it never shows up as a "not found" page.
      // This check has to live inside the cached function: an error that
      // leaves it reaches the caller as a plain Error, without its class.
      if (error instanceof NotFoundError) notFound()
      throw error
    })
  cacheTagPrismicPages([page])
  // Prismic also resolves a document's previous UIDs. Serving those would put
  // the same page at its old URL too, so only the current UID is a page.
  if (page.uid !== uid) notFound()
  return page
}

async function fetchSettings(ref?: string) {
  "use cache"
  cacheLife("max")
  const settings = await createClient().getSingle("settings", { ref })
  cacheTagPrismicPages([settings])
  return settings
}

async function fetchAllByType<TType extends UIDDocumentType>(
  type: TType,
  params: ListParams,
  ref?: string,
) {
  "use cache"
  cacheLife("max")
  const pages = await createClient().getAllByType(type, { ...params, ref })
  cacheTagPrismicPages(pages)
  cacheTag(PRISMIC_LISTS_TAG)
  return pages
}

/**
 * Fetches a document by UID, rendering the 404 page only when Prismic says the
 * document does not exist. Every other failure is rethrown. Neither outcome is
 * cached, because a cached function that throws stores nothing.
 */
export async function getByUIDOrNotFound<TType extends UIDDocumentType>(
  type: TType,
  uid: string,
) {
  return fetchByUID(type, uid, await getPreviewRef())
}

/** The site settings document (navigation, social links, contact, SEO defaults). */
export async function getSettings() {
  return fetchSettings(await getPreviewRef())
}

/** Every document of a type, for the list slices and the sitemap. */
export async function getAllByType<TType extends UIDDocumentType>(
  type: TType,
  params?: ListParams,
) {
  return fetchAllByType(type, params, await getPreviewRef())
}
