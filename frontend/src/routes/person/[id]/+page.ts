import { addMediaToID } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import type { PageLoad } from "./$types"
import type { Person } from "$lib/generated"

export const load: PageLoad = async ({ params, fetch }) => {
  const res = await fetch(`${PYTHON_API}/person/${params.id}`)

  if (res.status == 200) {
    const person: Person = await res.json()

    addMediaToID(person.movie_credits, "movie")
    addMediaToID(person.tv_credits, "tv")

    return { person }
  } else {
    throw new Error(res.statusText)
  }
}
