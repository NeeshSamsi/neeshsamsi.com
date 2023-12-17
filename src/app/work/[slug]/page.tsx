import { type Metadata } from "next"
import { type ReactNode } from "react"

import { allWorks } from "contentlayer/generated"
import { notFound } from "next/navigation"
import NextImage from "next/image"
import { useMDXComponent } from "next-contentlayer/hooks"
import Image from "@/components/ImagePreview"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import Button from "@/components/Button"

type Props = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return allWorks.map(({ slug }) => ({ slug }))
}

export function generateMetadata({ params }: Props) {
  const work = allWorks.find(({ slug }) => params.slug === slug)

  if (!work || (process.env.NODE_ENV !== "development" && !work.published)) {
    return {
      title: "404 - Not Found",
      description: "This page was not found.",
    } satisfies Metadata
  }

  const { title, description, image, slug } = work

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
    },
    alternates: {
      canonical: `/work/${slug}`,
    },
  } satisfies Metadata
}

export default function Work({ params }: Props) {
  const { slug } = params

  const work = allWorks.find((work) => work.slug === slug)

  if (!work || (process.env.NODE_ENV !== "development" && !work.published))
    notFound()

  const {
    title,
    tags,
    ctaText,
    ctaUrl,
    image,
    imageAlt,
    body: { code },
  } = work

  const MDXContent = useMDXComponent(code)
  const mdxComponents = {
    Image,
    H2: ({ children }: { children: ReactNode }) => {
      if (!children) throw new Error("No children in H2.")
      if (typeof children !== "string") throw new Error("No children in H2.")

      const arr = children.split(" ")
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
  }

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
        {ctaText && ctaUrl && (
          <div className="w-fit text-sm md:text-base xl:text-lg">
            <Button element="link" href={ctaUrl} type="outline" theme="light">
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
        <MDXContent components={mdxComponents} />
        {ctaText && ctaUrl && (
          <div className="not-prose mx-auto mt-6 w-fit text-base md:mt-10 md:text-lg xl:text-xl">
            <Button element="link" href={ctaUrl} type="solid" theme="light">
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
