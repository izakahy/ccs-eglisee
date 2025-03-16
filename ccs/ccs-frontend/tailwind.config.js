/** @type {import('tailwindcss').Config} */
import Typography from '@tiptap/extension-typography'
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b5b92', 
      },
    },
  },
  plugins: [
    Typography
  ],
}

