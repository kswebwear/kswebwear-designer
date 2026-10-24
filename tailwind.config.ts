import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ks: {
          ink: "var(--ks-ink)",
          paper: "var(--ks-paper)",
          fog: "var(--ks-fog)",
          placeholder: "var(--ks-placeholder)",
          line: "var(--ks-line)",
          "line-strong": "var(--ks-line-strong)",
          body: "var(--ks-body)",
          muted: "var(--ks-muted)",
          "on-dark": "var(--ks-on-dark)",
          "on-dark-muted": "var(--ks-on-dark-muted)",
          accent: "var(--ks-accent)",
          "accent-on-dark": "var(--ks-accent-on-dark)",
        },
      },
      fontFamily: {
        "ks-sans": "var(--ks-font-sans)",
        "ks-mono": "var(--ks-font-mono)",
      },
      fontSize: {
        "ks-h1": "var(--ks-h1)",
        "ks-h2": "var(--ks-h2)",
        "ks-h3": "var(--ks-h3)",
        "ks-body": "var(--ks-body-size)",
        "ks-label": "var(--ks-label-size)",
      },
      spacing: {
        "ks-gutter": "var(--ks-gutter)",
        "ks-section": "var(--ks-section-y)",
        "ks-tap": "var(--ks-tap)",
        "ks-btn": "var(--ks-btn-h)",
      },
      maxWidth: {
        "ks-container": "var(--ks-container)",
        "ks-wide": "var(--ks-container-wide)",
      },
      borderRadius: {
        ks: "var(--ks-radius)",
      },
    },
  },
  plugins: [],
};

export default config;
