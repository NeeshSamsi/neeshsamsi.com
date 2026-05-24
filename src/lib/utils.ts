import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type SettingsDocumentData } from "../../prismicio-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  // Intl.DateTimeFormat doesn't ship a "{month}, {year}" pattern in any
  // locale, so let it do all the localization (full month name, year
  // digits) via formatToParts, then join with our own comma separator.
  // This keeps month/year derivation native and limits custom logic to
  // just the joining character.
  const parts = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).formatToParts(date)

  const month = parts.find((p) => p.type === "month")?.value ?? ""
  const year = parts.find((p) => p.type === "year")?.value ?? ""

  return `${month}, ${year}`
}

export function getSocialLinks(data: SettingsDocumentData) {
  return [
    { id: "instagram", label: "Instagram", field: data.instagram },
    { id: "youtube", label: "YouTube", field: data.youtube },
    { id: "github", label: "GitHub", field: data.github },
    { id: "linkedin", label: "LinkedIn", field: data.linkedin },
  ]
}
