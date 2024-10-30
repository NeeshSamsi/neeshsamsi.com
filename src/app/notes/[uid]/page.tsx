import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SliceZone } from "@prismicio/react"

import { createClient } from "@/prismicio"
import { components } from "@/slices"
import Article from "@/components/Article"
import { asText } from "@prismicio/client"
import { formatDate } from "@/lib/utils"

type Params = { uid: string }

export default async function Page({ params }: { params: Params }) {
  const client = createClient()
  const page = await client
    .getByUID("notes", params.uid)
    .catch(() => notFound())

  const {
    last_publication_date: pubDate,
    data: { title, tags },
  } = page

  return (
    <>
      <main className="wrapper">
        <div className="mx-auto mt-8 max-w-[65ch] space-y-3 text-center md:mt-12 md:space-y-6">
          <h1 className="text-balance font-serif text-3xl font-medium text-brand md:text-4xl xl:text-5xl">
            {asText(title)}
          </h1>
          <div className="flex items-center justify-center gap-2 text-base font-light text-light sm:text-lg md:text-xl xl:text-2xl">
            <p>{tags}</p>
            <div className="size-1 rounded-full bg-lighter" />
            <p>{formatDate(new Date(pubDate))}</p>
          </div>
        </div>

        <Article>
          <SliceZone slices={page.data.slices} components={components} />
        </Article>
      </main>
    </>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const client = createClient()
  const page = await client
    .getByUID("notes", params.uid)
    .catch(() => notFound())

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
  const pages = await client.getAllByType("notes")

  return pages.map((page) => {
    return { uid: page.uid }
  })
}
