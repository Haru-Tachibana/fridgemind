/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
        'bounceIn': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      colors: {
        primary: {
          50: '#f3ffc6',
          100: '#f3ffc6',
          200: '#c3eb78',
          300: '#c3eb78',
          400: '#c3eb78',
          500: '#c3eb78',
          600: '#306b34',
          700: '#306b34',
          800: '#306b34',
          900: '#306b34',
        },
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#b6174b',
          600: '#b6174b',
          700: '#b6174b',
          800: '#b6174b',
          900: '#b6174b',
        },
        secondary: {
          50: '#f3ffc6',
          100: '#f3ffc6',
          200: '#c3eb78',
          300: '#c3eb78',
          400: '#c3eb78',
          500: '#c3eb78',
          600: '#1c5253',
          700: '#1c5253',
          800: '#1c5253',
          900: '#1c5253',
        },
        dark: {
          spring: '#306b34',
          slate: '#1c5253',
        },
        cream: '#f3ffc6',
        mindaro: '#c3eb78',
        amaranth: '#b6174b',
      }
    },
  },
  plugins: [],
}
