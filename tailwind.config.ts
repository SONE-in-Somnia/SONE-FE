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
        "text-glitch": "text-glitch 3s ease infinite",
        "glitch-anim-1": "glitch-anim-1 2s infinite",
        "glitch-anim-2": "glitch-anim-2 3s infinite",
        "schizo-glitch-text": "schizo-text-glitch 3s ease infinite",
        "schizo-glitch-anim-1": "schizo-glitch-anim-1 2s ease infinite",
        "schizo-glitch-anim-2": "schizo-glitch-anim-2 3s ease infinite",
        "blink": "blink 1s ease infinite",
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
