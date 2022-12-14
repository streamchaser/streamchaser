<script lang="ts">
  import { IMG_ORIGINAL } from "$lib/variables.js"
  import { currentCountry } from "$lib/stores/preferences"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Head from "$lib/components/head.svelte"
  import type { PageData } from "./$types"
  import { invalidateAll } from "$app/navigation"

  export let data: PageData
  const { movie } = data
  const posterUrl = IMG_ORIGINAL + movie.poster_path

  $: if ($currentCountry) {
    invalidateAll()
  }
</script>

<Head title={movie.title} description={movie.overview} images={[posterUrl]} />

<TopCard
  backdropPath={movie.backdrop_path}
  posterPath={movie.poster_path}
  title={movie.title}
  overview={movie.overview}
  genres={movie.genres}
  freeProviders={movie.free_providers}
  flatrateProviders={movie.flatrate_providers}
  runtime={movie.runtime}
  imdbId={movie.imdb_id}
  releaseDate={movie.release_date}
/>

<Person cast={movie.cast} />

<Recommendations recommendations={movie.recommendations} mediaType={"movie"} />
