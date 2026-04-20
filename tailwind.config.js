/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b10",
        card: "#15151d",
        line: "#24242f",
        ink: "#f5f5f7",
        mute: "#9a9aa8",
        accent: "#ff2d6f",
        easy: "#2dd4bf",
        medium: "#f59e0b",
        hard: "#ef4444",
      },
      fontFamily: {
        sys: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
