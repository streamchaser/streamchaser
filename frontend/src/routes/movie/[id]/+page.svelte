<script lang="ts">
  import { IMG_ORIGINAL } from "$lib/variables.js"
  import { currentCountry } from "$lib/stores/preferences"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Head from "$lib/components/head.svelte"
  import type { PageData } from "./$types"
  import { invalidate } from "$app/navigation"

  export let data: PageData

  $: if ($currentCountry) {
    invalidate("app:movie")
  }
</script>

<Head
  title={data.movie.title}
  description={data.movie.overview}
  images={[`${IMG_ORIGINAL}${data.movie.poster_path}`]}
/>

<TopCard
  backdropPath={data.movie.backdrop_path}
  posterPath={data.movie.poster_path}
  title={data.movie.title}
  overview={data.movie.overview}
  genres={data.movie.genres}
  freeProviders={data.movie.free_providers}
  flatrateProviders={data.movie.flatrate_providers}
  runtime={data.movie.runtime}
  imdbId={data.movie.imdb_id}
  releaseDate={data.movie.release_date}
/>

<Person cast={data.movie.cast} />

<Recommendations recommendations={data.movie.recommendations} mediaType={"movie"} />
