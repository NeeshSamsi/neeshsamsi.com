import { notFound } from "next/navigation"
import { NotFoundError, type Content } from "@prismicio/client"

import { createClient } from "@/prismicio"

export const client = createClient()

type UIDDocumentType = Exclude<Content.AllDocumentTypes["type"], "settings">

/**
 * Fetches a document by UID, rendering the 404 page only when Prismic says the
 * document does not exist. Every other failure (network error, API outage,
 * rate limit) is rethrown so it is never cached as a "not found" page.
 */
export async function getByUIDOrNotFound<TType extends UIDDocumentType>(
  type: TType,
  uid: string,
) {
  try {
    return await client.getByUID(type, uid)
  } catch (error) {
    if (error instanceof NotFoundError) notFound()
    throw error
  }
}
