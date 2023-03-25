<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading"
  import NoResults from "$lib/components/no_results.svelte"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import MediaCard from "$lib/components/media_card.svelte"
  import type { SelectGenresResult, Meilisearch } from "$lib/generated"

  export let meilisearch: Meilisearch
  export let providerAmounts: number[]
  export let currentProviders: { index: number; label: string; value: string }[]
  export let mediaStartAmount: number
  export let currentMediaAmount: number
  export let input: string
  export let currentGenres: SelectGenresResult[]
  export let search: Function

  const loadMoreData = async ({ detail: { loaded } }) => {
    currentMediaAmount += mediaStartAmount
    await search().then(() => {
      loaded()
    })
  }
</script>

{#if meilisearch && meilisearch.hits.length}
  <div
    class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
  >
    {#each meilisearch.hits as media, mediaIndex}
      <MediaCard {providerAmounts} {mediaIndex} {media} />
    {/each}
  </div>
  {#if meilisearch.hits.length === meilisearch.limit}
    <InfiniteLoading on:infinite={loadMoreData} />
  {:else}
    <p class="text-center italic">Showing {meilisearch.hits.length} results</p>
  {/if}
{:else if meilisearch && meilisearch.hits.length === 0}
  <NoResults {currentProviders} {currentGenres} {input} />
{:else}
  <Spinner timeout={false} />
{/if}
