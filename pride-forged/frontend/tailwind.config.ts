import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--text-primary-rgb) / <alpha-value>)",
        secondary: "rgb(var(--bg-secondary-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        graphite: "rgb(var(--text-secondary-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        metal: "rgb(var(--graphite-rgb) / <alpha-value>)",
        border: "var(--border)",
        input: "rgb(var(--surface-2-rgb) / <alpha-value>)",
        ring: "rgb(var(--accent-rgb) / <alpha-value>)",
        background: "rgb(var(--bg-rgb) / <alpha-value>)",
        foreground: "rgb(var(--text-primary-rgb) / <alpha-value>)"
      },
      boxShadow: {
        premium: "var(--shadow-premium)",
        liquid: "var(--shadow-liquid)",
        liquidHover: "var(--shadow-liquid-hover)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
