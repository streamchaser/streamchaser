import type { PageLoad } from "./$types"
import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import type { TV } from "$lib/generated"
import { currentCountry } from "$lib/stores/country.js"

export const load: PageLoad = async ({ params, fetch }) => {
  let country: string
  currentCountry.subscribe((v: string) => (country = v))

  const res = await fetch(`${PYTHON_API}/tv/${country}/${params.id}`)

  if (res.status == 200) {
    const tv: TV = await res.json()

    removeContentWithMissingImagePath(tv.cast, "profile_path")
    sortListByPopularity(tv.cast)

    return { tv }
  } else {
    throw new Error(res.statusText)
  }
}
