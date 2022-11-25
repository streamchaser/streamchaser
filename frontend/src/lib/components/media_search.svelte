<script lang="ts">
  import { fade } from "svelte/transition"
  import { mediaIdToUrlConverter } from "../utils"
  import InfiniteLoading from "svelte-infinite-loading"
  import NoResults from "$lib/components/no_results.svelte"
  import type { Meilisearch } from "../types"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import { IMG_ORIGINAL, IMG_W342 } from "../variables"
  import type { Genre, Media } from "$lib/generated"
  import { currentCountry } from "$lib/stores/country"

  const SHOWN_PROVIDERS: number = 5

  export let meilisearch: Meilisearch
  export let providerAmounts: number[]
  export let currentProviders: { index: number; label: string; value: string }[]
  export let mediaStartAmount: number
  export let currentMediaAmount: number
  export let input: string
  export let currentGenres: Genre[]
  export let search: Function

  const combineProviders = (media: Media) => {
    const providers = []
    if (media.providers) {
      if ("flatrate" in media.providers.results[$currentCountry]) {
        providers.push(...media.providers.results[$currentCountry]["flatrate"])
      }
      if ("free" in media.providers.results[$currentCountry]) {
        providers.push(...media.providers.results[$currentCountry]["free"])
      }
    }
    return providers
  }

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
      <a
        in:fade
        out:fade|local={{ duration: 200 }}
        href={mediaIdToUrlConverter(media.id)}
        data-sveltekit-prefetch
        class="card compact w-auto bordered bg-neutral m-1
                           shadow-md hover:contrast-75 hover:ring-2 ring-primary aspect-[19/33]"
      >
        {#if media.poster_path}
          <figure>
            <img src="{IMG_W342}{media.poster_path}" alt={media.title} />
          </figure>
        {:else}
          <figure class="grid place-items-center bg-slate-100 h-5/6">
            <h2 class="text-center text-lg text-gray-900">
              <strong>{media.title}</strong>
            </h2>
          </figure>
        {/if}
        {#if media.id.charAt(0) == "t"}
          <div class="absolute top-0 right-0 mx-1 -mt-1 opacity-85">
            <div class="badge badge-sm">TV</div>
          </div>
        {/if}
        {#if providerAmounts[mediaIndex] === 0}
          <div class="card-body">
            <p class="text-center text-neutral-content">
              <strong>No providers in {$currentCountry}</strong>
            </p>
          </div>
        {:else if providerAmounts[mediaIndex] <= SHOWN_PROVIDERS}
          <div class="-space-x-4 avatar-group">
            {#each combineProviders(media) as provider}
              <div class="avatar border-neutral">
                <div class="w-12 h-12">
                  <img
                    src="{IMG_ORIGINAL}{provider.logo_path}"
                    alt={provider.provider_name}
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="-space-x-4 avatar-group">
            {#each combineProviders(media).slice(0, SHOWN_PROVIDERS - 1) as provider}
              <div class="avatar border-neutral">
                <div class="w-12 h-12">
                  <img
                    src="{IMG_ORIGINAL}{provider.logo_path}"
                    alt={provider.provider_name}
                  />
                </div>
              </div>
            {/each}
            <div class="avatar placeholder border-neutral">
              <div class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                <span>
                  +{providerAmounts[mediaIndex] - SHOWN_PROVIDERS + 1}
                </span>
              </div>
            </div>
          </div>
        {/if}
      </a>
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
