export default function AboutCard({
  heading,
  content,
}: {
  heading: string
  content: string
}) {
  return (
    <div className="space-y-4 text-sm md:text-base lg:text-lg xl:text-xl">
      <h3 className="font-serif text-xl md:text-2xl">{heading}</h3>
      <p>{content}</p>
    </div>
  )
}
