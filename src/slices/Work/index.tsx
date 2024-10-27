import Headline from "@/components/Headline"
import Project from "@/components/Project"
import { client } from "@/lib/prismic"
import { asText, Content } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `Work`.
 */
export type WorkProps = SliceComponentProps<Content.WorkSlice>

/**
 * Component for "Work" Slices.
 */
const Work = async ({ slice }: WorkProps): Promise<JSX.Element> => {
  const {
    primary: { heading },
  } = slice

  const work = (await client.getAllByType("work")).sort(
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
      <Headline text={asText(heading)} />

      {work.length > 0 ? (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:gap-x-12">
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
