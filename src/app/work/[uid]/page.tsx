import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SliceZone } from "@prismicio/react"

import { createClient } from "@/prismicio"
import { components } from "@/slices"
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next"
import { asText } from "@prismicio/client"
import Article from "@/components/Article"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Button from "@/components/Button"

type Params = { uid: string }

export default async function Page(props: { params: Promise<Params> }) {
  const { uid } = await props.params
  const client = createClient()
  const page = await client.getByUID("work", uid).catch(() => notFound())

  const {
    data: { image, title, tags, cta },
  } = page

  return (
    <main className="wrapper">
      <div className="relative aspect-video w-full">
        <PrismicNextImage
          field={image}
          fill
          priority
          sizes="(min-width: 1360px) 1216px, calc(94.23vw - 47px)"
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>

      <div className="mt-8 space-y-3 md:mt-12 md:space-y-6">
        <h1 className="font-serif text-3xl font-medium md:text-4xl xl:text-5xl">
          {asText(title)}
        </h1>
        <p className="text-base font-light text-lighter sm:text-lg md:text-xl xl:text-2xl">
          {tags}
        </p>
        {cta.text && (
          <PrismicNextLink
            field={cta}
            className="inline-block w-fit text-sm md:text-base xl:text-lg"
          >
            <Button element="button" type="outline" theme="light">
              {cta.text}
              <ArrowTopRightOnSquareIcon
                className="aspect-square w-5"
                strokeWidth={2}
              />
            </Button>
          </PrismicNextLink>
        )}
      </div>

      <Article>
        <SliceZone slices={page.data.slices} components={components} />
      </Article>
    </main>
  )
}

export async function generateMetadata(props: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { uid } = await props.params
  const client = createClient()
  const page = await client.getByUID("work", uid).catch(() => notFound())

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
  const pages = await client.getAllByType("work")

  return pages.map((page) => {
    return { uid: page.uid }
  })
}
