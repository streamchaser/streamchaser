import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import { currentCountry } from "$lib/stores/country.js"
import type { PageLoad } from "./$types"
import type { Movie } from "$lib/generated"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import type { Provider } from "$lib/types"

export const load: PageLoad = async ({ params }) => {
  let country: string
  currentCountry.subscribe((v: string) => (country = v))

  const newMovie = await prisma.media.findUnique({
    where: {
      id: "m" + params.id,
    },
  })

  // FIXME: Cannot stringify arbitrary non-POJOs (data.newMovie.popularity)
  newMovie.popularity = null

  const flatrate: Provider[] = []
  const free: Provider[] = []

  // Does the tedious provider list logic server-side
  if (newMovie.providers[country]) {
    if (newMovie.providers[country].flatrate) {
      flatrate.push(...newMovie.providers[country].flatrate)
    }
    if (newMovie.providers[country].free) {
      free.push(...newMovie.providers[country].free)
    }
  }

  // Nukes the bloated provider data
  newMovie.providers = null

  // TODO: Remove fetching when all the needed data is in Postgres
  const res = await fetch(`${PYTHON_API}/movie/${country}/${params.id}`)

  if (res.status == 200) {
    const movie: Movie = await res.json()

    removeContentWithMissingImagePath(movie.cast, "profile_path")
    sortListByPopularity(movie.cast)

    return {
      movie,
      newMovie,
      providers: { flatrate, free },
    }
  } else {
    throw new Error(res.statusText)
  }
}
