import { type JSX } from "react"
import { asText, type Content } from "@prismicio/client"
import { type SliceComponentProps } from "@prismicio/react"
import { client } from "@/lib/prismic"
import Headline from "@/components/Headline"
import Button from "@/components/Button"
import Note from "@/components/Note"

/**
 * Props for `Notes`.
 */
export type NotesProps = SliceComponentProps<Content.NotesSlice>

/**
 * Component for "Notes" Slices.
 */
const Notes = async ({ slice }: NotesProps): Promise<JSX.Element> => {
  const {
    primary: { heading, cta, limit },
  } = slice

  const notes = await client.getAllByType("notes", {
    limit: limit ? limit : undefined,
    orderings: {
      field: "last_publication_date",
      direction: "desc",
    },
  })

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="notes"
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

      {notes.length > 0 ? (
        <div className="custom-cols grid gap-x-8 gap-y-16">
          {notes.map(
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
              <Note key={i} slug={slug} {...entry} />
            ),
          )}
        </div>
      ) : (
        <p className="text-sm md:text-base lg:text-lg xl:text-xl">
          No notes to show.
        </p>
      )}
    </section>
  )
}

export default Notes
