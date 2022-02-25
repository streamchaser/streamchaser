<script lang="ts">
  import InfiniteLoading from "svelte-infinite-loading"
  import {
    mediaIdToUrlConverter,
    calculateAmountOfShownItems,
    removeDuplicates,
    sortListByPopularity,
    removeContentWithMissingImagePath,
  } from "../../utils"

  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"
  export let media: []
  let currentMediaAmount = calculateAmountOfShownItems(
    window.visualViewport.width,
    [32, 28, 24, 20, 16, 10]
  )
  const mediaStartAmount = currentMediaAmount

  const loadMoreData = async ({ detail: { loaded } }) => {
    currentMediaAmount += mediaStartAmount
    loaded()
  }

  const getMediaTitle = media => {
    if (media.id.charAt(0) == "m") {
      return media.title
    } else {
      return media.name
    }
  }

  removeDuplicates(media)
  removeContentWithMissingImagePath(media, "poster_path")
  sortListByPopularity(media)
</script>

{#if media.length}
  <h1 class="text-center text-3xl pt-5">Movies & Series</h1>
  <div
    class="grid grid-cols-2 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4"
  >
    {#each media.slice(0, currentMediaAmount) as media}
      <a
        href={mediaIdToUrlConverter(media.id)}
        class="card compact bordered shadow-md
                       hover:contrast-75 hover:ring-2 ring-primary"
      >
        {#if media.id.charAt(0) == "t"}
          <div class="absolute top-0 right-0 mx-1 -mt-1 opacity-85">
            <div class="badge badge-sm">TV</div>
          </div>
        {/if}
        <figure>
          <img src="{LOW_RES_IMG_URL}{media.poster_path}" alt={getMediaTitle(media)} />
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
