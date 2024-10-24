import { type MetadataRoute } from "next"

import { url } from "@/lib/config"
import reader from "@/lib/keystatic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clientwork = await reader.collections.clientwork.all()

  if (!clientwork) throw new Error("Invalid Client Work Collection.")

  const workUrls = clientwork
    .filter((work) =>
      process.env.NODE_ENV === "production" ? work.entry.published : true,
    )
    .map((work) => ({
      url: `${url}/work/${work.slug}`,
      lastModified: new Date(work.entry.updatedAt),
    }))

  return [
    {
      url,
      lastModified: new Date(),
    },
    ...workUrls,
  ]
}
