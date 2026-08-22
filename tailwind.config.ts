import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Pine — a muted, grown-up forest green (the app's "growth" color).
        // Deliberately not Tailwind's stock emerald swatch.
        pine: {
          50: "#F1F7F1",
          100: "#DCEBE0",
          200: "#B9D7C1",
          300: "#93BFA3",
          400: "#6FA184",
          500: "#4C8468",
          600: "#386B52",
          700: "#2B5641",
          800: "#234636",
          900: "#1C3A2C",
        },
        primary: {
          DEFAULT: "#386B52", // Pine 600
          dark: "#2B5641", // Pine 700
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f8fafc", // Slate 50
          foreground: "#0f172a",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#F1F7F1", // Pine 50
          foreground: "#386B52",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
