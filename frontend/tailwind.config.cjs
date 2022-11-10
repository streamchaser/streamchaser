module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["luxury", "dark", "forest", "business", "coffee", "dracula", "night"],
  },
}
