import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type SettingsDocumentData } from "../../prismicio-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return formatter.format(date)
}

export function getSocialLinks(data: SettingsDocumentData) {
  return [
    { id: "instagram", label: "Instagram", field: data.instagram },
    { id: "youtube", label: "YouTube", field: data.youtube },
    { id: "github", label: "GitHub", field: data.github },
    { id: "linkedin", label: "LinkedIn", field: data.linkedin },
  ]
}
