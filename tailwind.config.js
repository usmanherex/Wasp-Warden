/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
    theme: {
    extend: {
      colors: {
        primary: {
          100: '#a273ff',
          200: '#935bff',
          300: '#8344ff',
          400: '#742cff',
          500: '#6415FF',
          600: '#5a13e6',
          700: '#5011cc',
          800: '#460fb3',
          900: '#3c0d99',
        },
      },
    },
  },
  plugins: [],
}

