/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Custom colors for the app - Premium Edition
        morning: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        planA: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        planB: {
          light: '#f472b6',
          DEFAULT: '#db2777',
          dark: '#9d174d',
        },
        premium: {
          bg: '#0a0a0c',
          card: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.12)',
          text: '#ffffff',
          subtitle: '#9ca3af',
        },
      },
    },
  },
  plugins: [],
};
