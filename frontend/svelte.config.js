/** @type {import('@sveltejs/kit').Config} */
import svelte from "svelte-preprocess"
import autoPreprocess from "svelte-preprocess"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import adapter from "@sveltejs/adapter-node"

const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: adapter(),
    vite: {
      server: {
        hmr: {
          host: "localhost", // host url
          port: 80, // 443 for https
          protocol: "ws", // wss for https
        },
      },
    },
  },
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
    typescript(),
  ],
  preprocess: sveltePreprocess(),
}

export default config
