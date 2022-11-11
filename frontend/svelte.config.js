/** @type {import('@sveltejs/kit').Config} */
import svelte from "svelte-preprocess"
import autoPreprocess from "svelte-preprocess"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import autoAdapter from "@sveltejs/adapter-auto"
import nodeAdapter from "@sveltejs/adapter-node"

console.log("is Vercel?", process.env.IS_VERCEL)

const config = {
  kit: {
    adapter: process.env.IS_VERCEL ? autoAdapter() : nodeAdapter(),
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
