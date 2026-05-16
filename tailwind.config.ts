import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"]
      },
      colors: {
        ink: "#0C0C0C",
        mist: "#D7E2EA"
      },
      boxShadow: {
        glow: "0 0 46px rgba(182, 0, 168, 0.32)"
      }
    }
  },
  plugins: []
} satisfies Config;
