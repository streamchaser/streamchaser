import type { SelectCountriesResult } from "$lib/generated"
import type { LayoutLoad } from "./$types"
import { PYTHON_API } from "$lib/variables"
import { env } from "$env/dynamic/public"

// TODO: Kill this with fire, when https://github.com/sveltejs/kit/issues/5606 is fixed
export const ssr = env.PUBLIC_ENV === "prod"

export const load: LayoutLoad = async ({ fetch }) => {
  const fetchCountries = async (): Promise<SelectCountriesResult[]> => {
    const res = await fetch(`${PYTHON_API}/countries`)
    return await res.json()
  }

  return { countries: fetchCountries() }
}
