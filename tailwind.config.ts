import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: "#FBF1F1",
          100: "#F3DCE1",
          200: "#E2B3BE",
          300: "#C87F91",
          400: "#A2536A",
          500: "#7E2F49",
          600: "#6B1E33",
          700: "#571526",
          800: "#3F0F1C",
          900: "#2A0A13",
        },
        olive: {
          50: "#F5F5EE",
          100: "#E9E9D6",
          200: "#D2D3AD",
          300: "#B4B683",
          400: "#8F9262",
          500: "#75784A",
          600: "#5E6239",
          700: "#4A4D2D",
          800: "#363822",
          900: "#242518",
        },
        ivory: {
          50: "#FFFEFC",
          100: "#FDFAF5",
          200: "#FAF5EC",
          300: "#F3EADA",
          400: "#EADFC8",
          500: "#DDCDAE",
        },
        ink: {
          400: "#7A6F66",
          500: "#5C5049",
          600: "#453C35",
          700: "#332B26",
          800: "#26201C",
          900: "#1A1512",
        },
        gold: {
          300: "#DECB9D",
          400: "#CBAE72",
          500: "#B8965A",
          600: "#9A7D49",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        content: "1240px",
        prose2: "70ch",
      },
      boxShadow: {
        card: "0 12px 40px -12px rgba(38, 32, 28, 0.18)",
        cardHover: "0 20px 60px -14px rgba(38, 32, 28, 0.26)",
      },
      transitionTimingFunction: {
        elegant: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
        fadeIn: "fadeIn 1.1s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
