/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        meadow: {
          DEFAULT: "#2d4a3e",
          light: "#3d6354",
          dark: "#1a2e26",
        },
        cream: {
          DEFAULT: "#f7f3eb",
          warm: "#efe8da",
          dark: "#e5dcc8",
        },
        stone: {
          DEFAULT: "#8a8278",
          light: "#a89f94",
          dark: "#5c564e",
        },
        terracotta: {
          DEFAULT: "#c4704a",
          light: "#d4896a",
          dark: "#a05838",
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1200px",
        prose: "65ch",
      },
      animation: {
        "fade-up": "fade-up 700ms ease-out both",
        "fade-in": "fade-in 600ms ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
