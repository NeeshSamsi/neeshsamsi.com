import { type Metadata } from "next"

import reader from "@/lib/keystatic"
import { notFound } from "next/navigation"

import { MDXRemote } from "next-mdx-remote/rsc"
import NextImage from "next/image"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Button from "@/components/Button"
import ImageWithPreview from "@/components/ImagePreview"
import { Suspense } from "react"

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await reader.collections.clientwork.list()

  return slugs
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params

  const clientwork = await reader.collections.clientwork.read(slug, {
    resolveLinkedFiles: true,
  })

  if (!clientwork) throw new Error(`Invalid Client Work - ${slug}`)

  if (process.env.NODE_ENV === "production" && clientwork.published === false) {
    return {
      title: "404 - Not Found",
      description: "This page was not found.",
    } satisfies Metadata
  }

  const { title, description, image } = clientwork

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      title,
      description,
      images: [image],
      card: "summary",
      creator: "@neeshsamsi",
    },
    alternates: {
      canonical: `/work/${slug}`,
    },
  } satisfies Metadata
}

export default async function Work({ params }: Props) {
  const { slug } = params

  const clientwork = await reader.collections.clientwork.read(slug, {
    resolveLinkedFiles: true,
  })

  if (!clientwork) throw new Error(`Invalid Client Work - ${slug}`)

  if (process.env.NODE_ENV === "production" && clientwork.published === false) {
    notFound()
  }

  const { image, imageAlt, title, tags, ctaText, ctaLink, content } = clientwork

  return (
    <main className="mt-6">
      <div className="relative aspect-video w-full">
        <NextImage
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1360px) 1216px, calc(94.23vw - 47px)"
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>

      <div className="mt-8 space-y-3 md:mt-12 md:space-y-6">
        <h1 className="font-serif text-2xl font-medium sm:text-3xl md:text-4xl xl:text-5xl">
          {title}
        </h1>
        <p className="text-base font-light text-lighter sm:text-lg md:text-xl xl:text-2xl">
          {tags}
        </p>
        {ctaText && ctaLink && (
          <div className="w-fit text-sm md:text-base xl:text-lg">
            <Button element="link" href={ctaLink} type="outline" theme="light">
              {ctaText}
              <ArrowTopRightOnSquareIcon
                className="aspect-square w-5"
                strokeWidth={2}
              />
            </Button>
          </div>
        )}
      </div>

      <article className="prose prose-base mx-auto mt-12 text-light md:prose-lg xl:prose-xl marker:text-lighter prose-headings:font-serif prose-headings:font-normal prose-headings:text-light prose-a:font-normal prose-a:text-lighter prose-a:underline-offset-2 prose-a:transition-colors hover:prose-a:text-brand prose-img:w-full prose-img:max-w-none prose-img:rounded-xl prose-img:object-cover md:mt-16">
        <Suspense fallback={<p>Loading...</p>}>
          <MDXRemote
            source={content}
            components={{
              H2(props) {
                const arr = props.text.split(" ")
                const first = arr[0]
                arr.shift()
                const rest = arr.join(" ")

                return (
                  <h2>
                    <span className="font-medium text-brand">{first} </span>
                    <span>{rest}</span>
                  </h2>
                )
              },
              ImageWithPreview(props: {
                readonly image: string
                readonly alt: string
                readonly width: number | null
                readonly height: number | null
              }) {
                const { image, alt, width, height } = props

                return (
                  <ImageWithPreview
                    src={image}
                    alt={alt}
                    width={width!}
                    height={height!}
                  />
                )
              },
            }}
          />
        </Suspense>

        {ctaText && ctaLink && (
          <div className="not-prose mx-auto mt-6 w-fit text-base md:mt-10 md:text-lg xl:text-xl">
            <Button element="link" href={ctaLink} type="solid" theme="light">
              {ctaText}
              <ArrowTopRightOnSquareIcon
                className="aspect-square w-6"
                strokeWidth={2}
              />
            </Button>
          </div>
        )}
      </article>
    </main>
  )
}
