import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5885AF", // (Muted Ocean Blue)
        secondary: "#EBAF82", // (Peachy Gold)
        accent: "#F7C488", // (Warmer Sand Yellow) – For highlights or call-to-action buttons
        background: "#F9F4EF", // (Off-white Cream)
        text: "#4D4D4D", // (Softer Charcoal)
        cardBackground: "#FFFFFF", // (Pure White)
        highlight: "#AFD3E2", // (Light Sky Blue)
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
