import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import { currentCountry } from "$lib/stores/country.js"
import type { PageServerLoad } from "./$types"
import type { Movie } from "$lib/generated"

export const load: PageServerLoad = async event => {
  let country: string
  currentCountry.subscribe(v => (country = v))

  const url: string = `${PYTHON_API}/movie/${country}/${event.params.id}`

  const res = await fetch(url)

  if (res.status == 200) {
    const movie: Movie = await res.json()
    removeContentWithMissingImagePath(movie.cast, "profile_path")
    sortListByPopularity(movie.cast)
    return { movie }
  } else {
    throw new Error(res.statusText)
  }
}
