import { addMediaToID } from "$lib/utils"
import { PYTHON_API } from "$lib/variables.js"
import type { PageServerLoad } from "./$types"
import type { Person } from "$lib/generated"

export const load: PageServerLoad = async event => {
  const PERSON_DETAIL_URL: string = `${PYTHON_API}/person/${event.params.id}`

  const response = await fetch(PERSON_DETAIL_URL)

  if (response.status == 200) {
    const person: Person = await response.json()

    addMediaToID(person.movie_credits, "movie")
    addMediaToID(person.tv_credits, "tv")

    return { person }
  } else {
    console.error(response.statusText)
    throw new Error(response.statusText)
  }
}
