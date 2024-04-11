import { collection, config, fields } from "@keystatic/core"
import { image } from "node_modules/@keystatic/core/dist/declarations/src/form/fields"

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
          components: {},
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
