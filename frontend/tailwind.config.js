/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // slate-950
        surface: '#0f172a', // slate-900
        primary: '#3b82f6', // blue-500
        critical: '#ef4444', // red-500
        warning: '#f59e0b', // amber-500
        safe: '#22c55e', // green-500
      }
    },
  },
  plugins: [],
}
