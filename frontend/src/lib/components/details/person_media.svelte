<script lang="ts">
  import MediaCard from "$lib/components/media_card.svelte"
  import {
    removeDuplicates,
    sortListByPopularity,
    removeContentWithMissingImagePath,
  } from "$lib/utils"
  import type { Media } from "$lib/types"
  import { PYTHON_API } from "$lib/variables"
  import { currentCountry } from "$lib/stores/country"
  import type { Meilisearch, Hit } from "$lib/generated"
  import Spinner from "../loading/spinner.svelte"

  export let media: Media[]

  let providerAmounts: number[]

  const hitProviderAmounts = (searchHits: Hit[]) => {
    providerAmounts = []
    searchHits.forEach(hit => {
      let combinedAmount = 0
      if (hit.providers) {
        if ("flatrate" in hit.providers.results[$currentCountry]) {
          combinedAmount += hit.providers.results[$currentCountry]["flatrate"].length
        }
        if ("free" in hit.providers.results[$currentCountry]) {
          combinedAmount += hit.providers.results[$currentCountry]["free"].length
        }
      }
      providerAmounts.push(combinedAmount)
    })
  }

  const lookupMedia = async (): Promise<Meilisearch> => {
    const ids = media.map(v => v.id)
    const res = await fetch(
      `${PYTHON_API}/media?c=${$currentCountry}&limit=${ids.length}&ids=${ids.join(
        "&ids="
      )}`
    )
    const json: Meilisearch = await res.json()

    hitProviderAmounts(json.hits)

    return json
  }

  let refreshLookupMedia = lookupMedia

  $: if ($currentCountry) {
    refreshLookupMedia = lookupMedia
  }

  removeDuplicates(media)
  removeContentWithMissingImagePath(media, "poster_path")
  sortListByPopularity(media)
</script>

{#if media.length}
  <h1 class="text-center text-3xl pt-5">Starred in</h1>
  {#await refreshLookupMedia()}
    <Spinner />
  {:then med}
    <div
      class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-1 p-2 pt-4"
    >
      {#each med.hits as media, index}
        <MediaCard {media} mediaIndex={index} {providerAmounts} />
      {/each}
    </div>
    <p class="text-center italic">Showing {med.hits.length} results</p>
  {/await}
{/if}
