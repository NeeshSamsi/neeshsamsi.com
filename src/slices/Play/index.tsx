import { type JSX } from "react"

import { asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { client } from "@/lib/prismic"
import SectionHeading from "@/components/SectionHeading"
import Button from "@/components/Button"
import Project from "@/components/Project"

/**
 * Props for `Play`.
 */
export type PlayProps = SliceComponentProps<Content.PlaySlice>

/**
 * Component for "Play" Slices.
 */
const Play = async ({ slice }: PlayProps): Promise<JSX.Element> => {
  const {
    primary: { heading, cta, limit },
  } = slice

  const play = await client.getAllByType("play", {
    limit: limit ? limit : undefined,
    orderings: {
      field: "document.last_publication_date",
      direction: "asc",
    },
  })

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="play"
      className="wrapper mt-24"
    >
      {asText(heading) && (
        <div className="flex justify-between gap-4">
          <SectionHeading text={asText(heading)} />

          <Button
            element="link"
            href="/work"
            type="outline"
            theme="light"
            className="h-fit text-xs md:text-sm lg:text-base xl:text-lg"
          >
            {cta}
          </Button>
        </div>
      )}

      {play.length > 0 ? (
        <div className="custom-cols grid gap-x-8 gap-y-16">
          {play.map(
            (
              {
                data: {
                  meta_image,
                  meta_title,
                  meta_description,
                  slices,
                  ...entry
                },
                uid: slug,
              },
              i,
            ) => (
              <Project
                key={i}
                slug={slug}
                type="play"
                {...entry}
                priority={i < 2}
              />
            ),
          )}
        </div>
      ) : (
        <p className="text-sm md:text-base lg:text-lg xl:text-xl">
          No work to showcase.
        </p>
      )}
    </section>
  )
}

export default Play
