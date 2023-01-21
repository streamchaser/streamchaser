<script lang="ts">
  import { IMG_ORIGINAL } from "$lib/variables.js"
  import { getMostPopularBackdropPath } from "$lib/utils"
  import TopCard from "$lib/components/details/top_card.svelte"
  import PersonMedia from "$lib/components/details/person_media.svelte"
  import Head from "$lib/components/head.svelte"
  import type { Person } from "$lib/generated"
  import type { PageData } from "./$types"

  export let data: PageData
  const { person } = data
  const posterUrl = IMG_ORIGINAL + person.profile_path

  const mediaCreditsWithoutAdult = (person: Person) => {
    return person.movie_credits.concat(person.tv_credits).filter(m => !m.adult)
  }
</script>

<Head title={person.name} description={person.biography} images={[posterUrl]} />

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
  mediaType={"person"}
/>

<PersonMedia media={mediaCreditsWithoutAdult(person)} />
