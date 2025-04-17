/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {},
  },
  plugins: [
    // Add a plugin for hiding scrollbars
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-hide": {
          /* Chrome, Safari and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
