/** @type {import('@sveltejs/kit').Config} */
import svelte from "svelte-preprocess"
import autoPreprocess from "svelte-preprocess"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import adapter from "@sveltejs/adapter-node"

const config = {
  kit: {
    adapter: adapter(),
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
