import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Official NUS corporate colours and derived web scales.
        // See COLOR_PALETTE.md for sources and usage rules.
        "nus-blue": {
          50: "#E8F0F9",
          100: "#C5D8ED",
          200: "#9ABCDE",
          300: "#6E9FCE",
          400: "#3D7BB7",
          500: "#155A9C",
          600: "#003D7C",
          700: "#003368",
          800: "#002850",
          900: "#001C39",
          DEFAULT: "#003D7C",
        },
        "nus-orange": {
          50: "#FEF4E6",
          100: "#FCE1C0",
          200: "#FACA92",
          300: "#F7B164",
          400: "#F39636",
          500: "#EF7C00",
          600: "#D26D00",
          700: "#AC5900",
          800: "#854500",
          900: "#5E3100",
          DEFAULT: "#EF7C00",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "Arial",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
