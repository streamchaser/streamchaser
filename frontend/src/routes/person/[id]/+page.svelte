<script lang="ts">
  import { getMostPopularBackdropPath } from "$lib/utils"
  import TopCard from "$lib/components/details/top_card.svelte"
  import PersonMedia from "$lib/components/details/person_media.svelte"
  import type { Person } from "$lib/generated"
  import type { PageData } from "./$types"

  export let data: PageData
  const { person } = data

  const mediaCreditsWithoutAdult = (person: Person) => {
    return person.movie_credits.concat(person.tv_credits).filter(m => !m.adult)
  }
</script>

<svelte:head>
  <title>{person.name} - Streamchaser</title>
</svelte:head>

<TopCard
  backdropPath={getMostPopularBackdropPath(
    person.movie_credits.concat(person.tv_credits)
  )}
  posterPath={person.profile_path}
  title={person.name}
  overview={person.biography}
  genres={null}
  freeProviders={null}
  flatrateProviders={null}
  runtime={null}
  imdbId={person.imdb_id}
  releaseDate={null}
/>

<PersonMedia media={mediaCreditsWithoutAdult(person)} />
