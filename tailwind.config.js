/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aqi: {
          good: '#10b981', // 0-50
          moderate: '#f59e0b', // 51-100
          poor: '#f97316', // 101-200
          unhealthy: '#ef4444', // 201-300
          severe: '#8b5cf6', // 301-400
          hazardous: '#7f1d1d', // 401+
        },
      },
    },
  },
  plugins: [],
}
