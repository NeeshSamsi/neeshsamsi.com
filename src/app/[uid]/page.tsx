import type { Metadata, ResolvingMetadata } from "next"
import { SliceZone } from "@prismicio/react"

import { components } from "@/slices"
import { buildPageMetadata, humanizeUid } from "@/lib/metadata"
import { client, getByUIDOrNotFound } from "@/lib/prismic"

type Params = { uid: string }

export default async function Page(props: { params: Promise<Params> }) {
  const { uid } = await props.params
  const page = await getByUIDOrNotFound("page", uid)

  return <SliceZone slices={page.data.slices} components={components} />
}

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { uid } = await props.params
  const page = await getByUIDOrNotFound("page", uid)

  return buildPageMetadata(
    {
      path: `/${uid}`,
      // The SEO tab is optional; name the page after its UID when it's empty.
      title: page.data.meta_title || humanizeUid(uid),
      description: page.data.meta_description,
      image: page.data.meta_image.url,
    },
    parent,
  )
}

export async function generateStaticParams() {
  const pages = await client.getAllByType("page")

  return pages.map((page) => {
    return { uid: page.uid }
  })
}
