import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import { currentCountry } from "$lib/stores/country.js"
import type { PageLoad } from "./$types"
import type { Movie } from "$lib/generated"

export const load: PageLoad = async ({ params, fetch }) => {
  let country: string
  currentCountry.subscribe((v: string) => (country = v))

  const res = await fetch(`${PYTHON_API}/movie/${country}/${params.id}`)

  if (res.status == 200) {
    const movie: Movie = await res.json()

    removeContentWithMissingImagePath(movie.cast, "profile_path")
    sortListByPopularity(movie.cast)

    return { movie }
  } else {
    throw new Error(res.statusText)
  }
}