<script lang="ts">
  import { PYTHON_API } from "$lib/variables.js"
  import { currentCountry } from "$lib/stores/country.js"
  import Seasons from "$lib/components/details/seasons.svelte"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Header from "$lib/components/header.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  const { tv } = data
  const posterUrl = PYTHON_API + `/image/?size=original&path=/${tv.poster_path}`

  let firstLoadCompleted = false

  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
  }
</script>

<Header title={tv.name} description={tv.overview} images={[posterUrl]} />

<TopCard
  backdropPath={tv.backdrop_path}
  posterPath={tv.poster_path}
  title={tv.name}
  overview={tv.overview}
  genres={tv.genres}
  freeProviders={tv.free_providers}
  flatrateProviders={tv.flatrate_providers}
  runtime={tv.episode_run_time[0]}
  imdbId={tv.imdb_id}
  releaseDate={tv.first_air_date}
/>

<Seasons seasons={tv.seasons} />

<Person cast={tv.cast} />

<Recommendations recommendations={tv.recommendations} mediaType={"tv"} />
