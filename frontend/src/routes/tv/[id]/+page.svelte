<script lang="ts">
  import { IMG_ORIGINAL } from "$lib/variables.js"
  import { currentCountry } from "$lib/stores/country.js"
  import Seasons from "$lib/components/details/seasons.svelte"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Head from "$lib/components/head.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  const { tv } = data
  const posterUrl = IMG_ORIGINAL + tv.poster_path

  let firstLoadCompleted = false

  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
  }
</script>

<Head title={tv.name} description={tv.overview} images={[posterUrl]} />

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
