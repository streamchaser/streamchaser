import type { PageLoad } from "./$types"
import { GO_API, PYTHON_API } from "$lib/variables.js"
import { currentCountry } from "$lib/stores/country.js"
import type { Genre } from "$lib/generated"

const GENRE_URL = `${GO_API}/genres/`
const PROVIDER_URL = `${PYTHON_API}/providers/`

export const load: PageLoad = async ({ fetch }) => {
  const fetchProviders = async (): Promise<string[]> => {
    let country: string
    currentCountry.subscribe((v: string) => (country = v))

    const res = await fetch(PROVIDER_URL + country)
    return await res.json()
  }

  const fetchGenres = async (): Promise<Genre[]> => {
    const res = await fetch(GENRE_URL)
    return await res.json()
  }

  return {
    providers: await fetchProviders(),
    genres: await fetchGenres(),
  }
}
