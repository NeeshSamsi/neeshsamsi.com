import { FC, Fragment } from "react"
import { Content, asText } from "@prismicio/client"
import { SliceComponentProps } from "@prismicio/react"

/**
 * Props for `ProjectOverview`.
 */
export type ProjectOverviewProps =
  SliceComponentProps<Content.ProjectOverviewSlice>

/**
 * Component for "ProjectOverview" Slices.
 */
const ProjectOverview: FC<ProjectOverviewProps> = ({ slice }) => {
  // // Use paragraphs from primary if it's a group, otherwise use slice.items
  // const items = "paragraphs" in slice.primary
  //   ? slice.primary.paragraphs
  //   : (slice.items as any[])

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="col-span-full mb-6 grid grid-cols-subgrid gap-y-8 md:mb-10 md:gap-y-12"
    >
      {slice.primary.paragraphs.map(({ title, description }, i) => (
        <Fragment key={i}>
          <div className="col-span-full md:col-span-5 lg:col-span-4">
            <h3 className="mb-2 font-serif text-2xl font-normal">
              {asText(title)}
            </h3>
            <p className="leading-relaxed font-light text-lighter">
              {asText(description)}
            </p>
          </div>

          {/* Inject a single 4-column spacer after every 2nd item.
              This fills the remaining 4 columns of the 12-column grid,
              elegantly pushing the 3rd item to start on a fresh row. */}
          {i % 2 === 1 && (
            <div
              className="hidden md:col-span-2 md:block lg:col-span-4"
              aria-hidden="true"
            />
          )}
        </Fragment>
      ))}
    </section>
  )
}

export default ProjectOverview
