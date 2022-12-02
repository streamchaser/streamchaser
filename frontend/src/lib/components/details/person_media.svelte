<script lang="ts">
  import MediaCard from "$lib/components/media_card.svelte"
  import {
    removeDuplicates,
    sortListByPopularity,
    removeContentWithMissingImagePath,
  } from "$lib/utils"
  import type { Media } from "$lib/types"
  import { currentCountry } from "$lib/stores/country"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import { lookupMedia } from "$lib/utils"

  export let media: Media[]

  removeDuplicates(media)
  removeContentWithMissingImagePath(media, "poster_path")
  sortListByPopularity(media)
</script>

{#if media.length}
  <h1 class="text-center text-3xl pt-5">Starred in</h1>
  {#await lookupMedia(media, $currentCountry)}
    <Spinner timeout={false} />
  {:then lookup}
    <div
      class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-1 p-2 pt-4"
    >
      {#each lookup.meilisearch.hits as hit, index}
        <MediaCard
          media={hit}
          mediaIndex={index}
          providerAmounts={lookup.providerAmounts}
        />
      {/each}
    </div>
    <p class="text-center italic">Showing {lookup.meilisearch.hits.length} results</p>
  {/await}
{/if}
