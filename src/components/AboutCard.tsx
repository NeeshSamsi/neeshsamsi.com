export default async function AboutCard({
  heading,
  paragraphs,
}: {
  heading: string
  paragraphs: string[]
}) {
  return (
    <div className="space-y-4 text-base lg:text-lg xl:text-xl">
      <h3 className="font-serif text-2xl md:text-3xl">{heading}</h3>
      {paragraphs.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  )
}
