/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/index.html",
    "./src/App.tsx",
    "./src/index.tsx",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {}, // NOTE: theme declaration over here
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
