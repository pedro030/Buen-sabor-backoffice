/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        BS_theme: {

          "primary": "#ef4444",

          "secondary": "#fecaca",

          "accent": "#1fb2a6",

          "neutral": "#2a323c",

          "base-100": "#f3f4f6",

          "info": "#3abff8",

          "success": "#36d399",

          "warning": "#facc15",

          "error": "#f87171",
        },
      },
      "dark",
      "light",
    ],
  },
  plugins: [require("daisyui")],
}

