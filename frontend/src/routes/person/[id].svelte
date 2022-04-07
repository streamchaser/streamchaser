<script lang="ts">
  import { addMediaToID, getMostPopularBackdropPath } from "../../utils"
  import { PYTHON_API } from "../../variables.js"
  import { page } from "$app/stores"
  import Error from "../../components/error.svelte"
  import TopCard from "../../components/details/top_card.svelte"
  import PersonMedia from "../../components/details/person_media.svelte"
  import Spinner from "../../components/loading/spinner.svelte"
  import type { Person } from "../../types"

  const PERSON_DETAIL_URL: string = `${PYTHON_API}/person/${$page.params.id}`

  let personName: string = "Loading..."
  const mediaCreditsWithoutAdult = (person: Person) => {
    return person.movie_credits.concat(person.tv_credits).filter(m => !m.adult)
  }
  const fetchPersonDetails = async () => {
    const response = await fetch(PERSON_DETAIL_URL)

    if (response.status == 200) {
      let jsonResponse = await response.json()
      personName = jsonResponse.name

      addMediaToID(jsonResponse.movie_credits, "movie")
      addMediaToID(jsonResponse.tv_credits, "tv")

      return jsonResponse
    } else {
      console.error(response.statusText)
      personName = "Error loading person"
      throw new Error(response.statusText)
    }
  }
</script>

<svelte:head>
  <title>{personName} - Streamchaser</title>
</svelte:head>

{#await fetchPersonDetails()}
  <Spinner />
{:then person}
  <TopCard
    backdropPath={getMostPopularBackdropPath(
      person.movie_credits.concat(person.tv_credits)
    )}
    posterPath={person.profile_path}
    title={person.name}
    overview={person.biography}
    genres={null}
    freeProviders={null}
    flatrateProviders={null}
    runtime={null}
    imdbId={null}
    releaseDate={null}
  />

  <PersonMedia media={mediaCreditsWithoutAdult(person)} />
{:catch error}
  <Error {error} />
{/await}
