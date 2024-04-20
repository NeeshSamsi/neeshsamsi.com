import { collection, config, fields } from "@keystatic/core"
import { block } from "@keystatic/core/content-components"

import KeystaticImagePreview from "@/components/KeystaticImagePreview"

export default config({
  storage: {
    kind: "github",
    repo: {
      owner: "neeshsamsi",
      name: "neeshsamsi.com",
    },
  },
  ui: {},

  singletons: {},

  collections: {
    clientwork: collection({
      label: "Client Work",
      path: "src/data/clientwork/*",
      slugField: "title",
      entryLayout: "content",
      format: {
        contentField: "content",
      },

      schema: {
        published: fields.checkbox({ label: "Published", defaultValue: false }),
        title: fields.slug({
          name: {
            label: "Title",
            validation: { isRequired: true },
          },
          slug: {
            label: "Slug",
            description: "URL Friendly version of the title",
          },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { isRequired: true },
        }),
        image: fields.image({
          label: "Cover Image",
          validation: { isRequired: true },
          directory: "/public/clientwork/",
          publicPath: "/clientwork/",
        }),
        imageAlt: fields.text({
          label: "Image Alt Text",
          description:
            "This is read out to visually impaired users or shown as a placeholder when the image cannot load.",
          validation: { isRequired: true },
        }),
        tags: fields.text({
          label: "Tags",
          validation: { isRequired: true },
        }),
        ctaText: fields.text({
          label: "Secondary CTA Text",
        }),
        ctaLink: fields.url({
          label: "Secondary CTA Link",
        }),
        updatedAt: fields.date({
          label: "Updated At",
          validation: { isRequired: true },
          defaultValue: new Date().toString(),
        }),
        content: fields.mdx({
          label: "Content",
          components: {
            H2: block({
              label: "Custom Heading",
              description: "Custom Heading 2. The first word is styled Yellow.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-heading-2"
                >
                  <path d="M4 12h8" />
                  <path d="M4 18V6" />
                  <path d="M12 18V6" />
                  <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
                </svg>
              ),
              schema: {
                text: fields.text({
                  label: "Text",
                  validation: { isRequired: true },
                }),
              },
              ContentView(props) {
                const arr = props.value.text.split(" ")
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
            }),
            ImageWithPreview: block({
              label: "Image with Preview",
              description: "Image with a fullscreen preview on click.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-image-plus"
                >
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <line x1="16" x2="22" y1="5" y2="5" />
                  <line x1="19" x2="19" y1="2" y2="8" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              ),
              schema: {
                image: fields.image({
                  label: "Image",
                  validation: { isRequired: true },
                  directory: "/public/clientwork/images/",
                  publicPath: "/clientwork/images/",
                }),
                alt: fields.text({
                  label: "Alt Text",
                  validation: { isRequired: true },
                }),
                width: fields.number({
                  label: "Width",
                  validation: { isRequired: true },
                }),
                height: fields.number({
                  label: "Height",
                  validation: { isRequired: true },
                }),
              },
              ContentView(props) {
                return <KeystaticImagePreview imgData={props.value.image} />
              },
            }),
          },
          options: {
            heading: [2, 3, 4, 5, 6],
            table: false,
            code: false,
            codeBlock: false,
          },
          extension: "mdx",
        }),
      },
    }),

    reviews: collection({
      label: "Reviews & Feedback",
      path: "src/data/reviews/*",
      format: "json",
      slugField: "name",

      schema: {
        name: fields.slug({
          name: { label: "Name", validation: { isRequired: true } },
          slug: {
            label: "Slug",
            description: "URL Friendly version of the name",
          },
        }),
        designation: fields.text({
          label: "Designation",
          validation: { isRequired: true },
        }),
        avatar: fields.image({
          label: "Avatar",
          validation: { isRequired: true },
          directory: "/public/reviews/",
          publicPath: "/reviews/",
        }),
        content: fields.text({
          label: "Review",
          multiline: true,
          validation: { isRequired: true },
        }),
      },
    }),
  },
})
