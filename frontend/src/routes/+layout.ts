import type { main_Country } from "$lib/generated/go"
import type { LayoutLoad } from "./$types"
import { PYTHON_API } from "$lib/variables"

export const load: LayoutLoad = async ({ fetch }) => {
  const fetchCountries = async (): Promise<main_Country[]> => {
    const res = await fetch(`${PYTHON_API}/countries`)
    return await res.json()
  }

  return { countries: fetchCountries() }
}
