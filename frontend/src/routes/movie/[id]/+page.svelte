<script lang="ts">
  import { currentCountry } from "$lib/stores/country.js"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  const { movie, newMovie, providers } = data

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
  <title>{newMovie.title} - Streamchaser</title>
</svelte:head>

<TopCard
  backdropPath={movie.backdrop_path}
  posterPath={newMovie.poster_path}
  title={newMovie.title}
  overview={newMovie.overview}
  genres={newMovie.genres}
  freeProviders={providers.free}
  flatrateProviders={providers.flatrate}
  runtime={movie.runtime}
  imdbId={movie.imdb_id}
  releaseDate={newMovie.release_date}
/>

<Person cast={movie.cast} />

<Recommendations recommendations={movie.recommendations} mediaType={"movie"} />
