import { type MetadataRoute } from "next"

import { url } from "@/lib/config"
import { getAllByType } from "@/lib/prismic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, projects, notes] = await Promise.all([
    getAllByType("page"),
    getAllByType("project"),
    getAllByType("notes"),
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
