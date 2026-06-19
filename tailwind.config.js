/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OStrack design tokens (safe theme) — wired to CSS variables
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        rule: "var(--rule)",
        "rule-2": "var(--rule-2)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        mute: "var(--mute)",
        faint: "var(--faint)",
        chip: "var(--chip)",
        brand: "var(--brand)",
        "brand-fg": "var(--brand-fg)",
        "brand-tint": "var(--brand-tint)",
        "brand-line": "var(--brand-line)",
        ok: "var(--ok)",
        warn: "var(--warn)",
        bad: "var(--bad)",
        info: "var(--info)",
        plum: "var(--plum)",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "card-1": "0 1px 0 rgba(11,15,28,0.04), 0 1px 2px rgba(11,15,28,0.04)",
        "card-2": "0 1px 0 rgba(11,15,28,0.04), 0 4px 12px rgba(11,15,28,0.06)",
        lift: "0 8px 24px rgba(11,15,28,0.10)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
