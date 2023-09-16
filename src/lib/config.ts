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
      heading: "Heading",
      paragraphs: [
        "Lorem ipsum dolor sit amet consectetur. Augue duis ornare risus eget purus habitant. Faucibus eu nunc nisl quis hendrerit at. Sit tempor quis elementum ultricies eget sagittis. Morbi aliquet sagittis id auctor rutrum diam diam et. Cursus.",
      ],
    },
    {
      heading: "Heading",
      paragraphs: [
        "Lorem ipsum dolor sit amet consectetur. Augue duis ornare risus eget purus habitant. Faucibus eu nunc nisl quis hendrerit at. Sit tempor quis elementum ultricies eget sagittis. Morbi aliquet sagittis id auctor rutrum diam diam et. Cursus.",
      ],
    },
    {
      heading: "Heading",
      paragraphs: [
        "Lorem ipsum dolor sit amet consectetur. Augue duis ornare risus eget purus habitant. Faucibus eu nunc nisl quis hendrerit at. Sit tempor quis elementum ultricies eget sagittis. Morbi aliquet sagittis id auctor rutrum diam diam et. Cursus.",
      ],
    },
  ],
}

export default config
