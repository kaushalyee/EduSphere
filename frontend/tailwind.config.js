/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#dbeafe",
          200: "#bfdbfe",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        accent: {
          100: "#ede9fe",
          600: "#7c3aed",
        },
      },
    },
  },
  plugins: [],
};