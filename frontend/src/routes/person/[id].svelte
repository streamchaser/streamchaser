<script lang="ts">
  import {
    removeContentWithMissingImagePath,
    sortListByPopularity,
    removeDuplicates,
  } from "../../utils"
  import { variables } from "../../variables.js"
  import { page } from "$app/stores"
  import Error from "../../components/error.svelte"
  import TopCard from "../../components/details/top_card.svelte"
  import PersonMedia from "../../components/details/person_media.svelte"
  import Spinner from "../../components/loading/spinner.svelte"

  const PERSON_DETAIL_URL: string = `${variables.apiPath}/person/${$page.params.id}`

  let personName: string = "Loading..."

  const fetchPersonDetails = async () => {
    const response = await fetch(PERSON_DETAIL_URL)

    if (response.status == 200) {
      let jsonResponse = await response.json()
      personName = jsonResponse.name
      removeContentWithMissingImagePath(jsonResponse.movie_credits, "poster_path")
      removeContentWithMissingImagePath(jsonResponse.tv_credits, "poster_path")

      removeDuplicates(jsonResponse.movie_credits)
      removeDuplicates(jsonResponse.tv_credits)

      sortListByPopularity(jsonResponse.movie_credits)
      sortListByPopularity(jsonResponse.tv_credits)

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
    backdropPath={person.movie_credits[0].backdrop_path}
    posterPath={person.profile_path}
    title={person.name}
    overview={person.biography}
    genres={null}
    providers={null}
    runtime={null}
    imdbId={null}
    releaseDate={null}
  />

  <PersonMedia media={person.movie_credits} mediaType={"movie"} title={"Movies"} />

  <PersonMedia media={person.tv_credits} mediaType={"tv"} title={"Series"} />
{:catch error}
  <Error {error} />
{/await}
