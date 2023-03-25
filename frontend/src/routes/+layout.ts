import type { SelectCountriesResult } from "$lib/generated"
import type { LayoutLoad } from "./$types"
import { PYTHON_API } from "$lib/variables"

export const load: LayoutLoad = async ({ fetch }) => {
  const fetchCountries = async (): Promise<SelectCountriesResult[]> => {
    const res = await fetch(`${PYTHON_API}/countries`)
    return await res.json()
  }

  return { countries: fetchCountries() }
}
