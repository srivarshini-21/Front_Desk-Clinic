/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6a0572',
        accent: '#b56576',
        'bg-soft': '#fff0f3',
        'text-dark': '#3c3c3c',
      },
    },
  },
  plugins: [],
}
