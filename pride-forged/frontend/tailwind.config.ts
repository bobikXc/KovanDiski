import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0D1B2A",
        secondary: "#1B263B",
        accent: "#4A6FA5",
        graphite: "#343A40",
        surface: "#FFFFFF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },
      boxShadow: {
        premium: "0 30px 80px rgba(13, 27, 42, 0.16)",
        liquid: "0 28px 90px rgba(13, 27, 42, 0.10)",
        liquidHover: "0 34px 110px rgba(13, 27, 42, 0.16)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
