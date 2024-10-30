import { type ReactNode } from "react"

export default function Article({ children }: { children: ReactNode }) {
  return (
    <article className="prose prose-base mx-auto mt-12 text-light md:prose-lg xl:prose-xl marker:text-lighter prose-headings:font-serif prose-headings:font-normal prose-headings:text-light prose-a:font-normal prose-a:text-lighter prose-a:underline-offset-2 prose-a:transition-colors hover:prose-a:text-brand prose-img:w-full prose-img:max-w-none prose-img:rounded-xl prose-img:object-cover md:mt-16">
      {children}
    </article>
  )
}
