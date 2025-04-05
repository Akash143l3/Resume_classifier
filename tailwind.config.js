/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // For old-style Next.js pages
    "./app/**/*.{js,ts,jsx,tsx}", // For App Router (Next.js 13+)
    "./components/**/*.{js,ts,jsx,tsx}", // For your reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
