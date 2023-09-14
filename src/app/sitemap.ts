import { type MetadataRoute } from "next"

import config from "@/lib/config"
import { allWorks } from "contentlayer/generated"

export default function sitemap(): MetadataRoute.Sitemap {
  const workUrls = allWorks
    .filter((work) => work.slug !== "template")
    .map((work) => ({
      url: `${config.url}/work/${work.slug}`,
      lastModified: new Date(work.updatedAt),
    }))

  return [
    {
      url: config.url,
      lastModified: new Date(),
    },
    ...workUrls,
  ]
}
