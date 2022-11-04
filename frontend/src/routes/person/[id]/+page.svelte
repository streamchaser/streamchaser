<script lang="ts">
  import { getMostPopularBackdropPath } from "$lib/utils"
  import TopCard from "$lib/components/details/top_card.svelte"
  import PersonMedia from "$lib/components/details/person_media.svelte"
  import type { Person } from "$lib/generated"
  import type { PageData } from "./$types"

  export let data: PageData

  const mediaCreditsWithoutAdult = (person: Person) => {
    return person.movie_credits.concat(person.tv_credits).filter(m => !m.adult)
  }
</script>

<svelte:head>
  <title>{data.person.name} - Streamchaser</title>
</svelte:head>

<TopCard
  backdropPath={getMostPopularBackdropPath(
    data.person.movie_credits.concat(data.person.tv_credits)
  )}
  posterPath={data.person.profile_path}
  title={data.person.name}
  overview={data.person.biography}
  genres={null}
  freeProviders={null}
  flatrateProviders={null}
  runtime={null}
  imdbId={data.person.imdb_id}
  releaseDate={null}
/>

<PersonMedia media={mediaCreditsWithoutAdult(data.person)} />
