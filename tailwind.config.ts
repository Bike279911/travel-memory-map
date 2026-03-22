import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        serif: ['Georgia', 'serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f2',
          100: '#ede9e0',
          200: '#d4cfc3',
          300: '#b8b1a1',
          400: '#9b9282',
          500: '#7e7568',
          600: '#635c52',
          700: '#4a4440',
          800: '#322e2b',
          900: '#1c1a18',
        },
        sand: {
          50: '#fdfcf8',
          100: '#f8f5ed',
          200: '#f0eadb',
          300: '#e4d8c1',
          400: '#d4c3a1',
          500: '#c0a97c',
        },
        ocean: {
          400: '#4b8fa8',
          500: '#3a7a94',
          600: '#2d6478',
        }
      },
    },
  },
  plugins: [],
}
export default config
