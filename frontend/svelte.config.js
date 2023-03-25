/** @type {import('@sveltejs/kit').Config} */
import svelte from "svelte-preprocess"
import autoPreprocess from "svelte-preprocess"
import sveltePreprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import nodeAdapter from "@sveltejs/adapter-node"
import vercelAdapter from "@sveltejs/adapter-vercel"

export default {
  kit: {
    adapter: process.env.VERCEL ? vercelAdapter() : nodeAdapter(),
  },
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
    typescript(),
  ],
  preprocess: sveltePreprocess(),
}
