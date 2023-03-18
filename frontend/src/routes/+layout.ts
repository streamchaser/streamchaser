import type { main_Country } from "$lib/generated/go"
import type { LayoutLoad } from "./$types"
import { GO_API } from "$lib/variables"
import { env } from "$env/dynamic/public"

// TODO: Kill this with fire, when https://github.com/sveltejs/kit/issues/5606 is fixed
export const ssr = env.PUBLIC_ENV === "prod"

export const load: LayoutLoad = async ({ fetch }) => {
  const fetchCountries = async (): Promise<main_Country[]> => {
    const res = await fetch(`${GO_API}/countries`)
    return await res.json()
  }

  return { countries: fetchCountries() }
}
