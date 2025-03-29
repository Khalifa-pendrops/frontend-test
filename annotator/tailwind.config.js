// type {import('tailwindcss').Config}
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "highlight-yellow": "rgba(255, 255, 0, 0.3)",
        "highlight-green": "rgba(0, 255, 0, 0.3)",
        "highlight-pink": "rgba(255, 0, 255, 0.3)",
      },
    },
  },
  plugins: [],
};
