import type { PageLoad } from "./$types"
import { removeContentWithMissingImagePath, sortListByPopularity } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import type { TV } from "$lib/generated"
import { currentCountry } from "$lib/stores/preferences"
import { env } from "$env/dynamic/public"

// TODO: Kill this with fire, when https://github.com/sveltejs/kit/issues/5606 is fixed
export const ssr = env.PUBLIC_ENV && env.PUBLIC_ENV === "prod"

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
