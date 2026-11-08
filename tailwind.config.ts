import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        elora: {
          ivory: "#F4F0E8",      // Primary background
          cream: "#EAE2D6",      // Secondary background
          surface: "#FFFFFF",    // Surface white
          charcoal: "#24211F",   // Primary text
          gray: "#77716A",       // Secondary text
          taupe: "#9A806B",      // Accent
          sand: "#D7C8B2",       // Secondary accent
          forest: "#26372F",     // Dark section
          border: "#DED7CC",     // Borders
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        ultra: ".35em",
      },
      boxShadow: {
        luxury: "0 20px 40px -15px rgba(36, 33, 31, 0.07)",
        card: "0 8px 30px rgba(36, 33, 31, 0.04)",
        drawer: "-10px 0 30px rgba(36, 33, 31, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

