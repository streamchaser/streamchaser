import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import type { LoadEvent } from "@sveltejs/kit"
import { currentCountry } from "$lib/stores/country.js"
import { get } from "svelte/store"

export const load = async (event: LoadEvent) => {
  // const country = get(currentCountry)
  const country = "DK"

  const url: string = `${PYTHON_API}/movie/${country}/${event.params.id}`

  const res = await fetch(url)

  if (res.status == 200) {
    let jsonResponse = await res.json()
    removeContentWithMissingImagePath(jsonResponse.cast, "profile_path")
    sortListByPopularity(jsonResponse.cast)
    return jsonResponse
  } else {
    console.log("oopsie")

    throw new Error(res.statusText)
  }
}
