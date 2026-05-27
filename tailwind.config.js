import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        animStar: {
          from: { transform: 'translateY(0px)' },
          to: { transform: 'translateY(-2000px)' },
        },
        tail: {
          '0%': { width: '0' },
          '30%': { width: '150px' },
          '100%': { width: '0' },
        },
        shooting: {
          '0%': { transform: 'translateX(0) translateY(0) rotate(-45deg)', opacity: '1' },
          '100%': { transform: 'translateX(-800px) translateY(800px) rotate(-45deg)', opacity: '0' },
        },
      },
      animation: {
        animStar: 'animStar 50s linear infinite',
        animStar100: 'animStar 100s linear infinite',
        animStar150: 'animStar 150s linear infinite',
        shootingStar: 'tail 4s ease-in-out infinite, shooting 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    daisyui,
  ],
}

