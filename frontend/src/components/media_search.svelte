<script lang="ts">
  import { mediaIdToUrlConverter } from "../utils"
  import NoResults from "../components/no_results.svelte"
  import type { Meilisearch } from "../types"
  import Spinner from "../components/loading/spinner.svelte"

  const SHOWN_PROVIDERS: number = 5
  const SHOW_BUTTON_AMOUNT: number = 21
  const IMG_URL: string = "https://image.tmdb.org/t/p/original/"
  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"

  export let meilisearch: Meilisearch
  export let providerAmounts: number[]
  export let currentCountry: string
  export let currentProviders: string[]
  export let mediaStartAmount: number
  export let currentMediaAmount: number
  export let input: string
  export let currentGenres: string[]
  export let search: Function

  const changeMediaAmount = (buttonElement: string) => {
    currentMediaAmount =
      buttonElement === "loadmore"
        ? currentMediaAmount + SHOW_BUTTON_AMOUNT
        : currentMediaAmount - SHOW_BUTTON_AMOUNT
    search()
  }
</script>

<!-- TODO: Why is both checks needed? -->
{#if meilisearch && meilisearch.hits.length}
  <div
    class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5
                    md:grid-cols-4 sm:grid-cols-3 gap-2 pt-2 pb-4"
  >
    {#each meilisearch.hits as media, mediaIndex}
      <a
        href={mediaIdToUrlConverter(media.id)}
        class="card compact w-auto bordered bg-neutral-focus m-1
                           shadow-md hover:contrast-75 hover:ring-2 ring-primary"
      >
        {#if media.id.charAt(0) == "t"}
          <div class="absolute top-0 right-0 mx-1 -mt-1 opacity-85">
            <div class="badge badge-sm">TV</div>
          </div>
        {/if}
        {#if media.poster_path}
          <figure>
            <img src="{LOW_RES_IMG_URL}{media.poster_path}" alt={media.title} />
          </figure>
        {:else}
          <figure class="grid place-items-center bg-slate-100 h-5/6">
            <h2 class="text-center text-lg text-gray-900">
              <strong>{media.title}</strong>
            </h2>
          </figure>
        {/if}
        {#if providerAmounts[mediaIndex] === 0}
          <div class="card-body">
            <p class="text-center text-neutral-content">
              <strong>No providers in {currentCountry}</strong>
            </p>
          </div>
        {:else if providerAmounts[mediaIndex] <= SHOWN_PROVIDERS}
          <div class="-space-x-4 avatar-group">
            {#each media.providers as provider}
              <div class="avatar border-neutral-focus">
                <div class="w-12 h-12">
                  <img
                    src="{IMG_URL}{provider.logo_path}"
                    alt={provider.provider_name}
                  />
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="-space-x-4 avatar-group">
            {#each media.providers.slice(0, SHOWN_PROVIDERS - 1) as provider}
              <div class="avatar border-neutral-focus">
                <div class="w-12 h-12">
                  <img
                    src="{IMG_URL}{provider.logo_path}"
                    alt={provider.provider_name}
                  />
                </div>
              </div>
            {/each}
            <div class="avatar placeholder border-neutral-focus">
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
  <div class="flex space-x-1 justify-center p-1">
    {#if currentMediaAmount > mediaStartAmount}
      <button
        on:click={() => {
          changeMediaAmount("loadless")
        }}
        id="loadless"
        class="btn"
      >
        Show less
      </button>
    {/if}
    {#if currentMediaAmount < meilisearch.nbHits}
      <button
        on:click={() => {
          changeMediaAmount("loadmore")
        }}
        id="loadmore"
        class="btn btn-primary"
      >
        Show more
      </button>
    {/if}
  </div>
{:else if meilisearch && meilisearch.hits.length === 0}
  <NoResults {currentProviders} {currentGenres} {input} />
{:else}
  <Spinner timeout={false} />
{/if}
