import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EBEFF5",
          100: "#D2DBE8",
          200: "#A5B7D1",
          300: "#7893BA",
          400: "#4A6FA3",
          500: "#2B4F81",
          600: "#173B67",
          700: "#0B2545", // primary navy
          800: "#081C36",
          900: "#051324",
        },
        teal: {
          50: "#E6F9F7",
          100: "#C0EFEB",
          200: "#87DED6",
          300: "#4FCDC1",
          400: "#1FB8AA",
          500: "#00A99D", // primary teal
          600: "#00897F",
          700: "#016B63",
          800: "#054E49",
          900: "#053733",
        },
        orange: {
          50: "#FFF1EC",
          100: "#FFDCCE",
          200: "#FFB99C",
          300: "#FF9670",
          400: "#FF7F52",
          500: "#FF6A3D", // primary orange - accent, use sparingly
          600: "#E6501F",
          700: "#BD3E14",
          800: "#8F2F10",
          900: "#63210B",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5F7FA",
          muted: "#EAEEF3",
        },
        ink: {
          DEFAULT: "#0B2545",
          soft: "#3C4A5E",
          faint: "#6B7A90",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#DDE3EC",
          strong: "#B9C4D3",
        },
        success: "#1FA35B",
        warning: "#E8A93B",
        danger: "#E14848",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xs: "6px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,37,69,0.06), 0 4px 16px rgba(11,37,69,0.06)",
        elevated: "0 8px 30px rgba(11,37,69,0.12)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        fadeIn: "fadeIn 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
