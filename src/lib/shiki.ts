import { createHighlighter } from "shiki"

export const languages = {
  TypeScript: "tsx",
  JavaScript: "jsx",
  HTML: "html",
  CSS: "css",
  Terminal: "bash",
  JSON: "json",
} as const

type LanguageLabel = keyof typeof languages

/**
 * Maps the slice's Language select to a Shiki grammar. The select can be left
 * empty in Prismic (and an old document can hold a label that no longer
 * exists); those render as plain text, which Shiki supports without a grammar.
 */
export function resolveLanguage(label: string | null | undefined) {
  return label && label in languages
    ? languages[label as LanguageLabel]
    : "text"
}

export async function getHighlighter() {
  return await createHighlighter({
    themes: ["aurora-x"],
    langs: Object.values(languages),
  })
}

const highlighter = getHighlighter()

export default highlighter
