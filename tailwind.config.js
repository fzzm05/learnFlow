/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#222222",
        border: "#2e2e2e",
        accent: "#95D1BD",
        "accent-bright": "#A5E1CB",
        primary: "#EFEFEF",
        secondary: "#8a8a8a",
        star: "#F59E0B",
        destructive: "#EF4444",
        "offline-bg": "#451A03",
        "offline-text": "#92400E",
      }
    }
  },
  plugins: []
};
