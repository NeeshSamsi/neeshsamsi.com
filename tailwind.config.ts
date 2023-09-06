import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-poppins)", ...defaultTheme.fontFamily.sans],
      serif: ["var(--font-sunset)", ...defaultTheme.fontFamily.serif],
    },
    extend: {
      colors: {
        dark: "#1D3557",
        light: "#E0FEFF",
        lighter: "#B8E0E1",
        brand: "#F4A430",
        accent: "#25BBC5",
      },
    },
  },
  plugins: [typography],
} satisfies Config
