import { type JSX } from "react"
import { type SliceComponentProps } from "@prismicio/react"
import { type Content, asText } from "@prismicio/client"
import * as prismic from "@prismicio/client"
import { client } from "@/lib/prismic"

import Button from "@/components/Button"
import ProjectGrid, { type ProjectGridItemType } from "@/components/ProjectGrid"
import PingDot from "@/components/PingDot"

export type ProjectShowcaseProps =
  SliceComponentProps<Content.ProjectShowcaseSlice>

/**
 * Component for "ProjectShowcase" Slices.
 */
const ProjectShowcase = async ({
  slice,
}: ProjectShowcaseProps): Promise<JSX.Element> => {
  const {
    primary: { heading, cta, limit, projectType, usage },
  } = slice

  const selectedCategory = projectType ?? "Exploration & Play"
  const isStandalone = usage === "Standalone Page"

  // Query prismic for the unified 'project' doc type and filter by the select field
  const documents = await client.getAllByType<Content.ProjectDocument>(
    "project",
    {
      limit: !isStandalone && limit ? limit : undefined,
      filters: [prismic.filter.at("my.project.type", selectedCategory)],
      orderings: {
        field: "my.project.publishedDate",
        direction: "desc",
      },
    },
  )

  // Map to the ProjectGrid format
  const gridItems: ProjectGridItemType[] = documents.map((doc) => {
    const { title, subtitle, image, type } = doc.data

    return {
      id: doc.id,
      title: title ?? "",
      subtitle: subtitle ?? "",
      image,
      link: `/projects/${doc.uid}`,
    }
  })

  const ctaRoute = selectedCategory === "Client Work" ? "/work" : "/play"

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id="project-showcase"
      className="col-span-full my-8 grid grid-cols-subgrid sm:my-12"
    >
      <div className="col-span-full">
        {asText(heading) && (
          <div className="flex flex-col-reverse items-start justify-between gap-2 sm:flex-row sm:items-end sm:gap-8">
            {isStandalone ? (
              <h1 className="w-full font-serif text-2xl font-normal xs:text-3xl sm:w-[70%] sm:text-4xl xl:w-[60%]">
                {asText(heading)}
              </h1>
            ) : (
              <h2 className="w-full font-serif text-2xl font-normal xs:text-3xl sm:w-[70%] sm:text-4xl xl:w-[60%]">
                {asText(heading)}
              </h2>
            )}
            <div className="flex shrink-0 items-center gap-2 pb-1 text-sm font-light sm:gap-3 sm:text-lg">
              <PingDot className="size-1.5 sm:size-2" />
              <span>{selectedCategory}</span>
            </div>
          </div>
        )}

        {gridItems.length > 0 ? (
          <>
            <div className="mt-8">
              <ProjectGrid items={gridItems} />
            </div>

            {!isStandalone && cta && limit && (
              <div className="mt-6 flex justify-center sm:mt-16">
                <Button
                  element="link"
                  href={ctaRoute}
                  type="outline"
                  theme="light"
                  className="text-xs sm:text-sm lg:text-base xl:text-lg"
                >
                  {cta}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="font mt-8 text-base text-lighter sm:text-lg">
            No projects to showcase.
          </p>
        )}
      </div>
    </section>
  )
}

export default ProjectShowcase
