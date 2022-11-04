<script lang="ts">
  import { currentCountry } from "$lib/stores/country.js"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import type { PageData } from "./$types"

  export let data: PageData

  let firstLoadCompleted = false // TODO: Kill with fire

  // TODO: Kill with fire
  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
  }
</script>

<svelte:head>
  <title>{data.movie.title} - Streamchaser</title>
</svelte:head>

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
