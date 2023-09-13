const config = {
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://neeshsamsi.com",
  siteName: "Neesh Samsi",
  twitter: "@neeshsamsi",
  themeColor: "#1D3557",
  description: "",

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
