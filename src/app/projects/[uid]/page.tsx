import { Metadata } from "next"
import { notFound } from "next/navigation"
import { asImageSrc } from "@prismicio/client"
import { SliceZone } from "@prismicio/react"

import { createClient } from "@/prismicio"
import { components } from "@/slices"
import { PrismicNextImage } from "@prismicio/next"

type Params = { uid: string }

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params
  const client = createClient()
  const {
    data: { image, title, subtitle, type, publishedDate, slices },
  } = await client.getByUID("project", uid).catch(() => notFound())

  return (
    <article className="col-span-full grid grid-cols-subgrid">
      <div className="col-span-full my-8 grid grid-cols-subgrid text-base md:my-12 md:text-xl">
        <h3 className="col-span-full mb-4 flex h-fit items-center gap-3 font-light xs:col-span-4 md:mb-0">
          <span className="text-brand">• </span> <span>{type}</span>
        </h3>

        <div className="col-span-full space-y-2 xs:col-span-8">
          <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
          <h2 className="font-light text-lighter">{subtitle}</h2>
        </div>
      </div>

      <PrismicNextImage
        field={image}
        className="col-span-full mb-8 aspect-video w-full rounded-lg object-cover md:mb-12"
      />

      <SliceZone slices={slices} components={components} />
    </article>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { uid } = await params
  const client = createClient()
  const page = await client.getByUID("project", uid).catch(() => notFound())

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  }
}

export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType("project")

  return pages.map((page) => ({ uid: page.uid }))
}
