<script lang="ts">
  import { currentCountry } from "$lib/stores/country.js"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  const { movie } = data

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
  <title>{movie.title} - Streamchaser</title>
</svelte:head>

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
