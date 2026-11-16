import type { Metadata, ResolvingMetadata } from "next"
import { SliceZone } from "@prismicio/react"

import { components } from "@/slices"
import HomeIntro from "@/components/HomeIntro"
import { buildPageMetadata } from "@/lib/metadata"
import { getByUIDOrNotFound } from "@/lib/prismic"

export default async function Page() {
  const page = await getByUIDOrNotFound("page", "home")

  return (
    <>
      <HomeIntro />
      <SliceZone slices={page.data.slices} components={components} />
    </>
  )
}

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const page = await getByUIDOrNotFound("page", "home")

  return buildPageMetadata(
    {
      path: "/",
      title: page.data.meta_title,
      description: page.data.meta_description,
      image: page.data.meta_image.url,
    },
    parent,
  )
}
