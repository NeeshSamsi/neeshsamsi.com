import { type JSX } from "react"
import { type SliceComponentProps } from "@prismicio/react"
import { type Content, asText } from "@prismicio/client"
import * as prismic from "@prismicio/client"
import { client } from "@/lib/prismic"

import Button from "@/components/Button"
import RevealButton from "@/components/RevealButton"
import ProjectGrid, { type ProjectGridItemType } from "@/components/ProjectGrid"
import ProjectShowcaseHeading from "@/components/ProjectShowcaseHeading"

export type ProjectShowcaseProps =
  SliceComponentProps<Content.ProjectShowcaseSlice>

/**
 * Component for "ProjectShowcase" Slices.
 */
const ProjectShowcase = async ({
  slice,
}: ProjectShowcaseProps): Promise<JSX.Element> => {
  const {
    primary: { heading, cta, limit, projectType, usage, exclude },
  } = slice

  const selectedCategory = projectType ?? "Exploration & Play"
  const isStandalone = usage === "Standalone Page"

  const filters = [prismic.filter.at("my.project.type", selectedCategory)]
  if (prismic.isFilled.contentRelationship(exclude)) {
    filters.push(prismic.filter.not("document.id", exclude.id))
  }

  // Query prismic for the unified 'project' doc type and filter by the select field
  const documents = await client.getAllByType<Content.ProjectDocument>(
    "project",
    {
      limit: !isStandalone && limit ? limit : undefined,
      filters,
      orderings: {
        field: "my.project.publishedDate",
        direction: "desc",
      },
    },
  )

  // Map to the ProjectGrid format
  const gridItems: ProjectGridItemType[] = documents.map((doc) => {
    const { title, subtitle, image, hoverImage, type } = doc.data

    return {
      id: doc.id,
      title: title ?? "",
      subtitle: subtitle ?? "",
      image,
      hoverImage,
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
          <ProjectShowcaseHeading
            heading={asText(heading)}
            category={selectedCategory}
            isStandalone={isStandalone}
          />
        )}

        {gridItems.length > 0 ? (
          <>
            <div className="mt-8">
              <ProjectGrid items={gridItems} />
            </div>

            {!isStandalone && cta && limit && (
              <div className="mt-6 flex justify-center sm:mt-16">
                <RevealButton>
                  <Button
                    element="link"
                    href={ctaRoute}
                    type="outline"
                    theme="light"
                    className="text-xs sm:text-sm lg:text-base xl:text-lg"
                  >
                    {cta}
                  </Button>
                </RevealButton>
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
