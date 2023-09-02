import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: "#1D3557",
        light: "#E0FEFF",
        lighter: "#B8E0E1",
        brand: "#F4A430",
        accent: "#25BBC5",
      }
    },
  },
  plugins: [],
}
export default config
