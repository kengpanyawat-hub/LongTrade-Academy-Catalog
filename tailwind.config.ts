import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: "#E31C25", bg: "#0A0A0A" },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 40px -10px rgba(227,28,37,0.35)"
      },
      borderColor: { glass: "rgba(227,28,37,0.25)" }
    }
  },
  plugins: []
} satisfies Config;
