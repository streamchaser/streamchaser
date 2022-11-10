<script lang="ts">
  import { fade } from "svelte/transition"
  import InfiniteLoading from "svelte-infinite-loading"
  import {
    mediaIdToUrlConverter,
    calculateAmountOfShownItems,
    removeDuplicates,
    sortListByPopularity,
    removeContentWithMissingImagePath,
    getMediaTitle,
  } from "../../utils"
  import type { Media } from "../../types"
  import { IMG_W342 } from "$lib/variables"
  import { onMount } from "svelte"

  export let media: Media[]

  let currentMediaAmount: number
  let mediaStartAmount: number

  // TODO: Kill with fire
  onMount(() => {
    currentMediaAmount = calculateAmountOfShownItems({
      width: window.visualViewport.width,
      xxl: 32,
      xl: 28,
      lg: 24,
      md: 20,
      sm: 16,
      mobile: 10,
    })
    mediaStartAmount = currentMediaAmount
  })

  const loadMoreData = async ({ detail: { loaded } }) => {
    currentMediaAmount += mediaStartAmount
    loaded()
  }

  removeDuplicates(media)
  removeContentWithMissingImagePath(media, "poster_path")
  sortListByPopularity(media)
</script>

{#if media.length}
  <h1 class="text-center text-3xl pt-5">Starred in</h1>
  <div
    class="grid grid-cols-2 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 md:grid-cols-4 gap-3 p-2 pt-4"
  >
    {#each media.slice(0, currentMediaAmount) as media}
      <a
        in:fade
        href={mediaIdToUrlConverter(media.id)}
        data-sveltekit-prefetch
        class="card compact bordered shadow-md
                       hover:contrast-75 hover:ring-2 ring-primary"
      >
        {#if media.id.charAt(0) == "t"}
          <div class="absolute top-0 right-0 mx-1 -mt-1 opacity-85">
            <div class="badge badge-sm">TV</div>
          </div>
        {/if}
        <figure>
          <img src="{IMG_W342}{media.poster_path}" alt={getMediaTitle(media)} />
        </figure>
      </a>
    {/each}
  </div>
  {#if media.length > currentMediaAmount}
    <InfiniteLoading on:infinite={loadMoreData} />
  {:else}
    <p class="text-center italic">Showing {media.length} results</p>
  {/if}
{/if}
