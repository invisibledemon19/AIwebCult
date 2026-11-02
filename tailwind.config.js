/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // HARD ENFORCEMENT: Completely erase all rounded corner scales to 0px
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        pureBlack: "#000000",
        starkWhite: "#FFFFFF",
        terminalGreen: "#00FF41",
        // Semantic overrides
        background: "#000000",
        foreground: "#FFFFFF",
        accent: "#00FF41",
        border: "#FFFFFF",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "Courier New", "monospace"],
        industrial: ["'Space Grotesk'", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        // Brutalist solid block drop shadows (0 blur, 0 spread)
        "brutal-green": "4px 4px 0px 0px #00FF41",
        "brutal-green-sm": "2px 2px 0px 0px #00FF41",
        "brutal-green-lg": "6px 6px 0px 0px #00FF41",
        "brutal-white": "4px 4px 0px 0px #FFFFFF",
        "brutal-black": "4px 4px 0px 0px #000000",
        none: "0 0 #0000",
      },
      borderWidth: {
        DEFAULT: "1px",
        1: "1px",
        2: "2px",
      },
      keyframes: {
        "invert-flash": {
          "0%, 100%": { filter: "invert(0)" },
          "50%": { filter: "invert(1)" },
        },
      },
      animation: {
        "invert-flash": "invert-flash 100ms steps(1, end)",
      },
    },
  },
  plugins: [],
};

