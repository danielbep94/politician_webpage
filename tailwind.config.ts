import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        line: "var(--color-line)",
        brand: {
          DEFAULT: "var(--color-brand)",
          dark: "var(--color-brand-dark)",
          soft: "var(--color-brand-soft)"
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)"
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)"
        }
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "sans-serif"
        ],
        serif: [
          "var(--font-serif)",
          "serif"
        ]
      },
      boxShadow: {
        soft: "0 18px 40px rgba(8, 26, 43, 0.08)"
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top, rgba(255,255,255,0.3), transparent 42%), linear-gradient(135deg, rgba(0,94,82,0.12), rgba(8,26,43,0.02))"
      }
    }
  },
  plugins: []
};

export default config;
