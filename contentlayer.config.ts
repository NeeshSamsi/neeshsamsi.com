import { defineDocumentType, makeSource } from "contentlayer/source-files"

export const Work = defineDocumentType(() => ({
  name: "Work",
  filePathPattern: "work/*.mdx",
  contentType: "mdx",
  fields: {
    image: { type: "string", required: true },
    imageAlt: { type: "string", required: true },
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    tags: { type: "string", required: true },
    published: { type: "boolean", default: false, required: true },
    updatedAt: { type: "date", required: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (work) => `/work/${work._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({ contentDirPath: "src/data", documentTypes: [Work] })
