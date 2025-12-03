import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        love: {
          50: '#fff0f3',
          100: '#ffe4e9',
          500: '#f43f5e',
          600: '#e11d48',
        },
        night: {
          900: '#0f172a',
          800: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
})

