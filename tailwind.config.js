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
    fontSize: {
      sm: ["0.8rem", "1rem"],
      base: ["1rem", "1.25rem"],
      xl: ["1.25rem", "1.563rem"],
      "2xl": ["1.563rem", "1.953rem"],
      "3xl": ["1.953rem", "1.441rem"],
      "4xl": ["2.441rem", "3.052rem"],
      "5xl": ["3.052rem", "3.5rem"],
    },
    extend: {
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
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
        blink: {
          "0%": { opacity: 1 },
          "49%": { opacity: 1 },
          "50%": { opacity: 0 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        wiggle: "wiggle 0.3s ease-in-out infinite",
        fallin: "fallin 5s ease-in-out forwards",
        wave: "wave 1s ease-in-out infinite",
        growFromCircle: "growFromCircle 2s linear 1 forwards",
        blink: "blink 1s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
