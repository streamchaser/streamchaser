<script lang="ts">
  import { IMG_ORIGINAL } from "$lib/variables.js"
  import Seasons from "$lib/components/details/seasons.svelte"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Head from "$lib/components/head.svelte"
  import type { PageData } from "./$types"
  import { invalidate } from "$app/navigation"
  import { currentCountry } from "$lib/stores/preferences"
  import { browser } from "$app/environment"

  export let data: PageData

  $: if (browser && $currentCountry) {
    invalidate("app:tv")
  }
</script>

<Head
  title={data.tv.name}
  description={data.tv.overview}
  images={[`${IMG_ORIGINAL}${data.tv.poster_path}`]}
/>

<TopCard
  backdropPath={data.tv.backdrop_path}
  posterPath={data.tv.poster_path}
  title={data.tv.name}
  overview={data.tv.overview}
  genres={data.tv.genres}
  freeProviders={data.tv.free_providers}
  flatrateProviders={data.tv.flatrate_providers}
  runtime={data.tv.episode_run_time[0]}
  imdbId={data.tv.imdb_id}
  releaseDate={data.tv.first_air_date}
/>

<Seasons seasons={data.tv.seasons} />

<Person cast={data.tv.cast} />

<Recommendations recommendations={data.tv.recommendations} mediaType={"tv"} />
