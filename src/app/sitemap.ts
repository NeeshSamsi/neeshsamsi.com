import { type MetadataRoute } from "next"
import { connection } from "next/server"

import { url } from "@/lib/config"
import { createClient } from "@/prismicio"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Built on each request, straight from Prismic. On Vercel a prerendered
  // sitemap ignores every on-demand refresh (tags and paths alike, while pages
  // honour them), so a cached one only changed on a deploy. Crawlers fetch it
  // rarely, so the uncached queries cost little.
  await connection()

  const client = createClient()
  const [pages, projects, notes] = await Promise.all([
    client.getAllByType("page"),
    client.getAllByType("project"),
    client.getAllByType("notes"),
  ])

  // Every routed document comes from Prismic, so the sitemap follows the
  // content: new pages appear and unpublished ones drop out on their own.
  const entry = (path: string, lastPublished: string) => ({
    url: `${url}${path}`,
    lastModified: new Date(lastPublished),
  })

  return [
    ...pages.map(({ uid, last_publication_date }) =>
      // The home document is served at "/" ("/home" redirects there).
      entry(uid === "home" ? "/" : `/${uid}`, last_publication_date),
    ),
    ...projects.map(({ uid, last_publication_date }) =>
      entry(`/projects/${uid}`, last_publication_date),
    ),
    ...notes.map(({ uid, last_publication_date }) =>
      entry(`/notes/${uid}`, last_publication_date),
    ),
  ]
}
