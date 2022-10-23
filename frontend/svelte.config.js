/** @type {import('@sveltejs/kit').Config} */
import svelte from "svelte-preprocess"
import staticAdapter from "@sveltejs/adapter-static";
import autoPreprocess from "svelte-preprocess"
import preprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"
import adapter from "@sveltejs/adapter-auto"

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: staticAdapter(),
  },
};

export default config;
