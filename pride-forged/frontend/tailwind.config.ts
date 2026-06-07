import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F4F7FB",
        secondary: "#0D1B2A",
        accent: "#3E6EA8",
        graphite: "#A9B7C9",
        surface: "#132238",
        metal: "#2A3442",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },
      boxShadow: {
        premium: "0 30px 90px rgba(0, 0, 0, 0.34)",
        liquid: "0 28px 90px rgba(0, 0, 0, 0.28)",
        liquidHover: "0 34px 110px rgba(62, 110, 168, 0.22)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
