/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sf-rounded': ['SFRounded', 'serif']
    },
    extend: {},
  },
  plugins: [require("daisyui")],
}
