/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1C1917",
        "background-light": "#FAFAF9",
        "background-dark": "#0C0A09",
        accent: "#F5F5F4",
        gold: "#D4AF37",
        clay: "#A8A29E"
      },
      fontFamily: {
        display: ["Instrument Serif", "serif"],
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        "large": "2rem",
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
        }
      },
      animation: {
        shake: 'shake 0.2s ease-in-out 0s 2',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
