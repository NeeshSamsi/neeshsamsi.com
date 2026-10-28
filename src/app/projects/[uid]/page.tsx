import { Metadata } from "next"
import { notFound } from "next/navigation"
import { asImageSrc, asText } from "@prismicio/client"
import { SliceZone } from "@prismicio/react"

import { createClient } from "@/prismicio"
import { components } from "@/slices"
import { PrismicNextImage } from "@prismicio/next"
import PingDot from "@/components/PingDot"
import { formatDate } from "@/lib/utils"

type Params = { uid: string }

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid } = await params
  const client = createClient()
  const {
    data: { image, title, subtitle, type, publishedDate, slices },
  } = await client.getByUID("project", uid).catch(() => notFound())

  return (
    <article className="col-span-full grid grid-cols-subgrid">
      <div className="col-span-full my-6 grid grid-cols-subgrid text-base md:my-10 md:text-xl">
        <h3 className="col-span-full mb-4 flex h-fit items-center gap-3 font-light xs:col-span-4 md:mb-0">
          <PingDot className="size-1.5 md:size-2" /> <span>{type}</span>
        </h3>

        <div className="col-span-full space-y-2 xs:col-span-8">
          <p className="text-sm font-light text-lighter capitalize">
            {formatDate(new Date(publishedDate!))}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl">{title}</h1>
          <h2 className="font-light text-lighter">{subtitle}</h2>
        </div>
      </div>

      <PrismicNextImage
        field={image}
        className="col-span-full mb-6 aspect-video w-full rounded-lg object-cover md:mb-8"
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
  const { data } = await client.getByUID("project", uid).catch(() => notFound())

  // The SEO tab is optional per project. When a field is empty, fall back to
  // the project's own content so the social preview never inherits the
  // site-wide bio and never ships an empty og:image.
  const overview = data.slices.find(
    (slice) => slice.slice_type === "project_overview",
  )
  const overviewText =
    overview?.slice_type === "project_overview"
      ? (asText(overview.primary.paragraphs[0]?.description) ?? "")
      : ""

  const title = data.meta_title || data.title || undefined
  const description =
    data.meta_description ||
    truncate(overviewText, 160) ||
    data.subtitle ||
    undefined
  const image =
    asImageSrc(data.meta_image) ??
    asImageSrc(data.image, { w: 1200, h: 630, fit: "crop" }) ??
    undefined
  const images = image ? [{ url: image }] : undefined

  return {
    title,
    description,
    openGraph: { title, description, type: "article", images },
    twitter: { card: "summary_large_image", title, description, images },
  }
}

function truncate(text: string, max: number) {
  const clean = text.trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`
}

export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType("project")

  return pages.map((page) => ({ uid: page.uid }))
}
