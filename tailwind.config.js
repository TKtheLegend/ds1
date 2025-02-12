/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            'box-shadow': '0 0 25px 3px rgba(255, 255, 255, 0.15)',
          },
          '50%': {
            'box-shadow': '0 0 35px 6px rgba(255, 255, 255, 0.3)',
          },
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}