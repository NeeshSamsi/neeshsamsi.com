import { type MetadataRoute } from "next"

import { url } from "@/lib/config"
import { client } from "@/lib/prismic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const work = await client.getAllByType("work")
  const notes = await client.getAllByType("notes")

  const workUrls = work.map(({ uid, data: { pubDate } }) => ({
    url: `${url}/work/${uid}`,
    lastModified: new Date(pubDate!),
  }))
  const notesUrls = notes.map(({ uid, last_publication_date }) => ({
    url: `${url}/notes/${uid}`,
    lastModified: new Date(last_publication_date),
  }))

  const staticUrls = [
    {
      url: `${url}/`,
      lastModified: new Date(),
    },
    {
      url: `${url}/work`,
      lastModified: new Date(),
    },
    {
      url: `${url}/notes`,
      lastModified: new Date(),
    },
  ]

  return [...staticUrls, ...workUrls, ...notesUrls]
}
