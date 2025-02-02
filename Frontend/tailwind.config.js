/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        dmserif: ['DM Serif Text', 'cursive'], // Add Helvetica
      },
    },
  },
  plugins: [],
}
