<script lang="ts">
  import { PYTHON_API } from "$lib/variables.js"
  import { getMostPopularBackdropPath } from "$lib/utils"
  import TopCard from "$lib/components/details/top_card.svelte"
  import PersonMedia from "$lib/components/details/person_media.svelte"
  import Header from "$lib/components/header.svelte"
  import type { Person } from "$lib/generated"
  import type { PageData } from "./$types"

  export let data: PageData
  const { person } = data
  const posterUrl = PYTHON_API + `/image/?size=original&path=/${person.profile_path}`

  const mediaCreditsWithoutAdult = (person: Person) => {
    return person.movie_credits.concat(person.tv_credits).filter(m => !m.adult)
  }
</script>

<Header title={person.name} description={person.biography} images={[posterUrl]} />

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
