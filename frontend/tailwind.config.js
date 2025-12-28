/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#ffcfc9',
          300: '#feada3',
          400: '#fb7d6e',
          500: '#f25540',
          600: '#df3521',
          700: '#bb2818',
          800: '#9a2418',
          900: '#80241b',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Fun kid-friendly colors
        sunshine: {
          light: '#FFF59D',
          DEFAULT: '#FFD54F',
          dark: '#FFA000',
        },
        bubblegum: {
          light: '#F8BBD0',
          DEFAULT: '#F06292',
          dark: '#C2185B',
        },
        ocean: {
          light: '#B3E5FC',
          DEFAULT: '#4FC3F7',
          dark: '#0277BD',
        },
        grass: {
          light: '#C5E1A5',
          DEFAULT: '#8BC34A',
          dark: '#558B2F',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        fun: ['Fredoka', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        'fun': '2rem',
        'super-fun': '3rem',
      }
    },
  },
  plugins: [],
}
