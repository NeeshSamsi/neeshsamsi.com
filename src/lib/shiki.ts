import { createHighlighter } from "shiki"

export const languages = {
  TypeScript: "tsx",
  JavaScript: "jsx",
  HTML: "html",
  CSS: "css",
  Terminal: "bash",
  JSON: "json",
} as const

export async function getHighlighter() {
  return await createHighlighter({
    themes: ["aurora-x"],
    langs: Object.values(languages),
  })
}

const highlighter = getHighlighter()

export default highlighter
