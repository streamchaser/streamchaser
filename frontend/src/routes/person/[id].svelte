<script lang="ts">
  import { sortListByPopularity } from "../../utils"
  import { variables } from "../../variables.js"
  import { page } from "$app/stores"
  import Error from "../../components/error.svelte"
  import TopCard from "../../components/details/top_card.svelte"
  import PersonMedia from "../../components/details/person_media.svelte"
  import Spinner from "../../components/loading/spinner.svelte"
  import TopCard from "../../components/details/top_card.svelte"

  const PERSON_DETAIL_URL: string = `${variables.apiPath}/person/${$page.params.id}`

  let personName: string = "Loading..."

  const addMediaToID = (mediaArray: object[], mediaType: string) => {
    for (let i = 0; i < mediaArray.length; i++) {
      mediaArray[i].id = mediaType.charAt(0) + mediaArray[i].id
    }
  }

  const getMostPopularBackdropPath = mediaList => {
    sortListByPopularity(mediaList)
    return mediaList[0].backdrop_path
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

  <PersonMedia media={person.movie_credits.concat(person.tv_credits)} />
{:catch error}
  <Error {error} />
{/await}
