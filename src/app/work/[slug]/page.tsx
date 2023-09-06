import { type Metadata } from "next"

import { notFound } from "next/navigation"
import { useMDXComponent } from "next-contentlayer/hooks"
import { allWorks } from "contentlayer/generated"
import Image from "next/image"
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

  if (!work || !work.published) {
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
      canonical: slug,
    },
  } satisfies Metadata
}

export default function Work({ params }: Props) {
  const { slug } = params

  const work = allWorks.find((work) => work.slug === slug)

  if (!work || !work.published) notFound()

  const {
    title,
    tags,
    liveUrl,
    image,
    imageAlt,
    body: { code },
  } = work

  const MDXContent = useMDXComponent(code)

  return (
    <main className="mt-12 space-y-6 md:space-y-8">
      <div className="relative aspect-video w-full">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>

      <div className="space-y-2 md:space-y-4">
        <h1 className="font-serif text-2xl font-medium sm:text-3xl md:text-4xl xl:text-5xl">
          {title}
        </h1>
        <p className="text-base font-light text-lighter sm:text-lg md:text-xl xl:text-2xl">
          {tags}
        </p>
        {liveUrl && (
          <div className="w-fit text-sm md:text-base xl:text-lg">
            <Button element="link" href={liveUrl} type="outline" theme="light">
              Visit live site
              <ArrowTopRightOnSquareIcon
                className="aspect-square w-5"
                strokeWidth={2}
              />
            </Button>
          </div>
        )}
      </div>

      <article className="prose prose-sm sm:prose-base md:prose-lg xl:prose-xl marker:lighter prose-headings:text-light prose-headings:font-serif prose-headings:font-normal prose-img:rounded-xl prose-img:w-full prose-img:aspect-video text-light">
        <MDXContent />
      </article>
    </main>
  )
}
