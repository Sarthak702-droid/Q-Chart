import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { background: "#0B1020", surface: "#12182B", elevated: "#1A2238", indigo: "#5B5CEB", cyan: "#2DD4BF", textPrimary: "#F8FAFC", textSecondary: "#CBD5E1", textMuted: "#94A3B8", success: "#22C55E", warning: "#F59E0B", danger: "#EF4444", info: "#38BDF8" },
      fontFamily: { display: ["Hanken Grotesk", "Inter Tight", "Inter", "sans-serif"], body: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { glass: "0 8px 32px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.10)", float: "0 30px 80px rgba(0,0,0,0.40)" }
    }
  }
} satisfies Config;
