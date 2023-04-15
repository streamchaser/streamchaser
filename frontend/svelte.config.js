import { vitePreprocess } from "@sveltejs/kit/vite"
import nodeAdapter from "@sveltejs/adapter-node"
import vercelAdapter from "@sveltejs/adapter-vercel"

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: process.env.VERCEL ? vercelAdapter() : nodeAdapter(),
  },
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
