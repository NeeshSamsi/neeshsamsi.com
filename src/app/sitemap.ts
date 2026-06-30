import { type MetadataRoute } from "next"

import { url } from "@/lib/config"
import { client } from "@/lib/prismic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await client.getAllByType("project")
  const notes = await client.getAllByType("notes")

  const projectUrls = projects.map(({ uid, data: { publishedDate } }) => ({
    url: `${url}/projects/${uid}`,
    lastModified: new Date(publishedDate!),
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
      url: `${url}/play`,
      lastModified: new Date(),
    },
    {
      url: `${url}/notes`,
      lastModified: new Date(),
    },
  ]

  return [...staticUrls, ...projectUrls, ...notesUrls]
}
