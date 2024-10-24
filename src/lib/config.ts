export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.neeshsamsi.com"

const config = {
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.neeshsamsi.com",
  siteName: "Neesh Samsi",
  twitter: "@neeshsamsi",
  themeColor: "#1D3557",
  description:
    "Hey, I'm Neesh. I create intuitive and functional experiences on the web. I am a passionate UI/UX designer & developer. I use Figma to conceptualise and Next.js & Typescript to bring my designs to life. I am proficient in Design Fundamentals and Figma as well as Javscript, Typescript, React and Next.js",

  about: [
    {
      heading: "Why Design?",
      paragraphs: [
        "Design is a powerful medium that goes beyond creativity. It's about solving problems. Good design stays invisible, bad design gets noticed. I'm fascinated by the intersection of beauty and functionality, and I believe in creating designs that not only look good but also feel intuitive.",
      ],
    },
    {
      heading: "Philosophy & Expertise",
      paragraphs: [
        "My approach is rooted in collaboration and continuous improvement. I am proficient in using Figma for wireframing, high-fidelity and basic prototyping. I am also comfortable building in web technologies like Javascript & React using Next.js & Astro.",
      ],
    },
    {
      heading: "Let's Create Together",
      paragraphs: [
        "As I continue to learn and evolve, I'm excited about the possibility of collaborating on projects that push boundaries. Ready to elevate your digital presence? Let's connect and explore the exciting possibilities of design!",
      ],
    },
  ],

  reviews: [
    {
      image: "/reviews/parth.jpg",
      name: "Parth Phalke",
      title: "Director, Srot Foundation",
      quote:
        "Your support and suggestions were excellent, resulting in a website we love. We were impressed by your prompt responses and modifications. We'll definitely hire you for future projects.",
    },
    // {
    //   image: "/reviews/garima.jpg",
    //   name: "Garima Arya",
    //   title: "Founder, Kalakulam Academy",
    //   quote:
    //     "Your support and suggestions were excellent, resulting in a website we love.",
    // },
  ],
}

export default config
