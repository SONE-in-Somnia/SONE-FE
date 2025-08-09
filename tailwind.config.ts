import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#1E1E1E",
        background: "#dedede",
        "retro-gray": "#C0C0C0",
        "retro-gray-1": "#A8A8A8",
        "retro-gray-2": "#E9E9E9",
        "retro-gray-3": "#D0D0D0",
        "retro-gray-4": "#ACACAC",
        "retro-blue": "#000080",
        "retro-green": "#00FF00",
        "retro-orange": "#FFA500",
        "retro-red": "#FF0000",
        "retro-yellow": "#FFFF00",
        "retro-pink": "#F764FF",
        "retro-black": "#1E1E1E",

      },
      borderRadius: {},
      animation: {
        "color-stroke-flow": "color-stroke-flow 5s ease-in-out infinite",
        glitch: "glitch 1s ease-in-out",
      },
      keyframes: {
        "color-stroke-flow": {
          "0%, 100%": {
            color: "var(--retro-pink)",
            "-webkit-text-stroke-color": "var(--retro-yellow)",
          },
          "25%": {
            color: "var(--retro-yellow)",
            "-webkit-text-stroke-color": "var(--retro-green)",
          },
          "50%": {
            color: "var(--retro-green)",
            "-webkit-text-stroke-color": "var(--retro-blue)",
          },
          "75%": {
            color: "var(--retro-blue)",
            "-webkit-text-stroke-color": "var(--retro-pink)",
          },
        },
        glitch: {
          "0%": {
            transform: "translate(0)",
            opacity: "1",
          },
          "25%": {
            transform: "translate(5px, -5px)",
            clipPath: "polygon(0 0, 100% 0, 100% 20%, 0 20%)",
          },
          "50%": {
            transform: "translate(-5px, 5px)",
            clipPath: "polygon(0 80%, 100% 80%, 100% 100%, 0 100%)",
          },
          "75%": {
            transform: "translate(5px, 0px)",
            clipPath: "polygon(0 40%, 100% 40%, 100% 60%, 0 60%)",
          },
          "100%": {
            transform: "translate(0)",
            opacity: "1",
          },
        },
      },
      fontFamily: {
        "modern-warfare": ["var(--font-modern-warfare)"],
        "pixel-operator": ["PixelOperator", "sans-serif"],
        "pixel-operator-mono": ["PixelOperatorMono", "sans-serif"],
        "pixel-operator-mono-bold": ["PixelOperatorMonoBold", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animated"), addVariablesForColors],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}
