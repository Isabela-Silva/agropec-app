/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          100: "#BDE79A", // Verde bem claro
          200: "#8CC152", // Verde médio
          300: "#3B7F44", // Verde oliva
          400: "#38761D", // Verde escuro
          500: "#053A35", // Verde mais escuro
        },
        gold: {
          100: "#FDD835", // Amarelo/Dourado claro
          200: "#D4AF37", // Dourado médio
          300: "#C0941F", // Dourado escuro
        },
        red: {
          100: "#F5C2C2",
        },
        "base-white": "#FFFFFF",
        "base-white-light": "#F3F3F3",
        "base-black": "#333333",
        "base-gray": "#6D6D6D",
        "base-gray-light": "#A7ADA4",
      },
    },
  },
  plugins: [],
};
