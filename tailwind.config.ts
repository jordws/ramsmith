import type { Config } from "tailwindcss";

/**
 * RAMSmith design tokens — "site-ops control room".
 * Ink + steel surfaces, disciplined hi-vis signal yellow, mono for data.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#12151C",
          900: "#0C0E13",
          800: "#12151C",
          700: "#1B2029",
          600: "#272E3A",
          500: "#3A4350",
        },
        signal: {
          DEFAULT: "#F4C20D", // hi-vis, primary action only
          600: "#D9A900",
          100: "#FDF3C9",
        },
        paper: "#F7F8FA",
        line: "#E4E7EC",
        muted: "#6B7280",
        ok: "#12B76A",
        warn: "#F79009",
        danger: "#F04438",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,21,28,0.04), 0 8px 24px -12px rgba(16,21,28,0.12)",
        lift: "0 12px 40px -12px rgba(16,21,28,0.28)",
      },
      backgroundImage: {
        // The signature hazard-stripe motif, used sparingly.
        hazard:
          "repeating-linear-gradient(-45deg, #F4C20D 0 14px, #12151C 14px 28px)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
