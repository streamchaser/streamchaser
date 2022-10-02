<script lang="ts">
  import { currentCountry } from "$lib/stores/country.js"
  import Person from "$lib/components/details/person.svelte"
  import TopCard from "$lib/components/details/top_card.svelte"
  import Recommendations from "$lib/components/details/recommendations.svelte"

  export let data

  let firstLoadCompleted = false

  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      location.reload()
    }
    firstLoadCompleted = true
  }
</script>

<svelte:head>
  <title>{data.title} - Streamchaser</title>
</svelte:head>

<TopCard
  backdropPath={data.backdrop_path}
  posterPath={data.poster_path}
  title={data.title}
  overview={data.overview}
  genres={data.genres}
  freeProviders={data.free_providers}
  flatrateProviders={data.flatrate_providers}
  runtime={data.runtime}
  imdbId={data.imdb_id}
  releaseDate={data.release_date}
/>

<Person cast={data.cast} />

<Recommendations recommendations={data.recommendations} mediaType={"movie"} />
