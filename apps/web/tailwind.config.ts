import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        "canvas-deep": "var(--canvas-deep)",
        card: "var(--card)",
        "card-soft": "var(--card-soft)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "ink-4": "var(--ink-4)",
        line: "var(--line)",
        "line-2": "var(--line-2)",
        brand: "var(--brand)",
        "brand-soft": "var(--brand-soft)",
        "brand-ink": "var(--brand-ink)",
      },
      fontFamily: {
        // Sans-only. `serif` still resolves to Inter so any lingering
        // `font-serif` class doesn't fall back to Georgia.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "20px", sheet: "28px", field: "12px", pill: "999px" },
      boxShadow: {
        card: "0 1px 2px rgba(42,38,32,0.04), 0 8px 24px rgba(42,38,32,0.05)",
        lift: "0 2px 4px rgba(42,38,32,0.05), 0 18px 50px rgba(42,38,32,0.14)",
      },
    },
  },
  plugins: [],
} satisfies Config;
