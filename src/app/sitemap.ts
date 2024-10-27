import { type MetadataRoute } from "next"

import { url } from "@/lib/config"
import { client } from "@/lib/prismic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const work = await client.getAllByType("work")

  const workUrls = work.map(({ uid, data: { pubDate } }) => ({
    url: `${url}/work/${uid}`,
    lastModified: new Date(pubDate!),
  }))

  return [
    {
      url,
      lastModified: new Date(),
    },
    ...workUrls,
  ]
}
