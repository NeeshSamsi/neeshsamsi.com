import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SliceZone } from "@prismicio/react"

import { createClient } from "@/prismicio"
import { components } from "@/slices"

type Params = { uid: string }

export default async function Page(props: { params: Promise<Params> }) {
  const { uid } = await props.params

  const client = createClient()
  const page = await client.getByUID("page", uid).catch(() => notFound())

  return <SliceZone slices={page.data.slices} components={components} />
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { uid } = await props.params

  const client = createClient()
  const page = await client.getByUID("page", uid).catch(() => notFound())

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [page.data.meta_image.url!],
    },
  }
}

export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType("page")

  return pages.map((page) => {
    return { uid: page.uid }
  })
}
