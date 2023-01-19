/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        fallin: {
          "0%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(0%)" },
        },
        wave: {
          "0%": { transform: "translateY(0%)" },
          "25%": { transform: "translateY(-20%)" },
          "50%": { transform: "translateY(0%)" },
          "75%": { transform: "translateY(20%)" },
          "100%": { transform: "translateY(0%)" },
        },
        growFromCircle: {
          "0%": { transform: "scale(0)", opacity: 0, borderRadius: "100%" },
          "25%": {
            transform: "scale(1)",
            opacity: 1,
            borderRadius: "100%",
          },
          "50%": {
            transform: "scale(0.75)",
            opacity: 0.5,
            borderRadius: "0%",
          },
          "75%": {
            transform: "scale(1.1)",
            opacity: 0.4,
            borderRadius: "10%",
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
            borderRadius: "0%",
          },
        },
      },
      animation: {
        wiggle: "wiggle 0.3s ease-in-out infinite",
        fallin: "fallin 5s ease-in-out forwards",
        wave: "wave 1s ease-in-out infinite",
        growFromCircle: "growFromCircle 2s linear 1 forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
