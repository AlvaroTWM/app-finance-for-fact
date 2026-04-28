export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Montserrat", "serif"],
        ueno: ["Inter", "sans-serif"],
        "ueno-display": ["Montserrat", "serif"],
      },
    },
  },
  plugins: [],
};
