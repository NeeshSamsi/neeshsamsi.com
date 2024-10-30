import { type JSX } from "react"
import { type SliceComponentProps } from "@prismicio/react"
import { type Content, asText } from "@prismicio/client"
import { client } from "@/lib/prismic"

import Headline from "@/components/Headline"
import Project from "@/components/Project"
import Button from "@/components/Button"

/**
 * Props for `Work`.
 */
export type WorkProps = SliceComponentProps<Content.WorkSlice>

/**
 * Component for "Work" Slices.
 */
const Work = async ({ slice }: WorkProps): Promise<JSX.Element> => {
  const {
    primary: { heading, cta, limit },
  } = slice

  const work = (
    await client.getAllByType("work", {
      limit: limit ? limit : undefined,
    })
  ).sort(
    (a, b) =>
      new Date(b.data.pubDate!).valueOf() - new Date(a.data.pubDate!).valueOf(),
  )

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="work"
      className="wrapper mt-24"
    >
      {asText(heading) && (
        <div className="flex justify-between gap-4">
          <Headline text={asText(heading)} />

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

      {work.length > 0 ? (
        <div className="custom-cols grid gap-x-8 gap-y-16">
          {work.map(
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
              <Project key={i} slug={slug} {...entry} priority={i < 2} />
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

export default Work
