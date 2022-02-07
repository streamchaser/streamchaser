<script lang="ts">
  import {
    removeContentWithMissingImagePath,
    routeToPage,
    sortListByPopularity,
  } from "../../utils"
  import { variables } from "../../variables.js"
  import { page } from "$app/stores"
  import { currentCountry } from "../../stores/country.js"
  import Navbar from "../../components/navbar.svelte"
  import Footer from "../../components/footer.svelte"
  import Seasons from "../../components/details/seasons.svelte"
  import Error from "../../components/error.svelte"
  import Person from "../../components/details/person.svelte"
  import CookieDisclaimer from "../../components/cookie_disclaimer.svelte"
  import TopCard from "../../components/details/top_card.svelte"
  import Recommendations from "../../components/details/recommendations.svelte"
  import Spinner from "../../components/loading/spinner.svelte"

  const TV_DETAIL_URL: string = `${variables.apiPath}/tv/${$currentCountry}/${$page.params.id}`

  let tvTitle = "Loading..."

  const fetchTVDetails = async () => {
    const response = await fetch(TV_DETAIL_URL)

    if (response.status == 200) {
      let jsonResponse = await response.json()
      tvTitle = jsonResponse.name

      removeContentWithMissingImagePath(jsonResponse.cast, "profile_path")
      sortListByPopularity(jsonResponse.cast)

      return jsonResponse
    } else {
      console.error(response.statusText)
      tvTitle = "Error loading tv"
      throw new Error(response.statusText)
    }
  }

  let firstLoadCompleted = false

  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
  }
</script>

<svelte:head>
  <title>{tvTitle} - Streamchaser</title>
</svelte:head>

{#await fetchTVDetails()}
  <Spinner />
{:then tv}
  <TopCard
    backdropPath={tv.backdrop_path}
    posterPath={tv.poster_path}
    title={tv.name}
    overview={tv.overview}
    genres={tv.genres}
    providers={tv.providers}
    runtime={tv.episode_run_time[0]}
    imdbId={null}
    releaseDate={tv.first_air_date}
  />

  <Seasons seasons={tv.seasons} />

  <Person cast={tv.cast} />

  <Recommendations recommendations={tv.recommendations} mediaType={"tv"} />
{:catch error}
  <Error {error} />
{/await}
