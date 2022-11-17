<script lang="ts">
  import { PYTHON_API } from "$lib/variables.js"
  import { currentCountry } from "$lib/stores/country.js"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"
  import Head from "$lib/components/head.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
  const { movie } = data
  const posterUrl = PYTHON_API + `/image/?size=original&path=/${movie.poster_path}`

  let firstLoadCompleted = false // TODO: Kill with fire

  // TODO: Kill with fire
  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
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
