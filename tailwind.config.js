module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // 'media' or 'class'
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 2.3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      colors: {
        "accent-1": "#333",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
