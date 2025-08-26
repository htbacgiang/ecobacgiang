/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-gradient-to-br',
    'bg-gradient-to-r',
    // Green gradient classes for Eco Bắc Giang brand
    'from-green-50',
    'to-emerald-50',
    'from-green-100',
    'to-green-100',
    'bg-green-100',
    'bg-green-50',
    'hover:bg-green-50',
    'border-green-200',
    'ring-green-100',
    'bg-green-500',
    'text-green-600',
    'text-green-100',
    'text-green-700',
    'group-hover:text-green-700',
    'from-green-400',
    'to-emerald-600',
    'from-green-500',
    'to-emerald-600',
    'from-green-600',
    'to-emerald-700',
    'from-green-700',
    'to-emerald-800',
    'hover:from-green-700',
    'hover:to-emerald-800',
    'via-emerald-600', 
    'to-teal-600',
    'to-emerald-400',
    'animate-pulse',
    'backdrop-blur-xl',
    'backdrop-blur-sm'
  ],
  theme: {
    extend: {
      animation: {
        blink: "blink 1.5s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { backgroundColor: "rgb(34, 197, 94)" }, // màu xanh
          "50%": { backgroundColor: "#f97316" }, // màu đỏ
        },
      },
      fontFamily: {
        heading: ["var(--ltn__heading-font)", "sans-serif"], // Sử dụng font Rajdhani
      },
      colors: {
        "primary-dark": "#1f1f1f",
        primary: "#ffffff",
        highlight: {
          dark: "#FFFFFF",
          light: "#1f1f1f",
        },
        secondary: {
          dark: "#707070",
          light: "#e6e6e6",
        },
        action: "#3B82F6",
      },
      transitionProperty: {
        width: "width",
      },
    },
    backgroundImage: {
      "png-pattern": "url('/empty-bg.jpg')",
      "gradient-to-b": "linear-gradient(to bottom, #22c55e, #16a34a)",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-scrollbar")],
};
