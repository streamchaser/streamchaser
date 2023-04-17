<script lang="ts">
  import { mediaIdToUrlConverter, calculateAmountOfShownItems } from "../../utils"
  import type { Cast } from "../../types"
  import { IMG_W342 } from "../../variables"
  import { onMount } from "svelte"

  export let cast: Cast[]

  let castItemAmount: number
  let castItemStartAmount: number

  // TODO: Make this happen in a less insane way
  onMount(() => {
    castItemAmount = calculateAmountOfShownItems({
      width: window.visualViewport.width,
      xxl: 18,
      xl: 16,
      lg: 14,
      md: 10,
      sm: 12,
      mobile: 9,
    })
    castItemStartAmount = castItemAmount
  })
</script>

{#if cast.length}
  <h1 class="pt-5 text-3xl text-center">Cast</h1>
  <div
    class="grid grid-cols-3 gap-3 p-2 pt-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9"
  >
    {#each cast.slice(0, castItemAmount) as person}
      {#if person.profile_path}
        <a
          href={mediaIdToUrlConverter("p" + person.id)}
          data-sveltekit-preload-data
          class="shadow-md hover:ring-2 card compact bordered bg-neutral ring-primary hover:contrast-75"
        >
          <figure>
            <img src="{IMG_W342}{person.profile_path}" alt={person.name} />
          </figure>
          <div class="card-body">
            <p class="text-neutral-content">
              <b>{person.name}</b> - <i>{person.character}</i>
            </p>
          </div>
        </a>
      {/if}
    {/each}
  </div>
  <div class="flex justify-center pt-5 space-x-1">
    {#if castItemAmount < cast.length}
      <button
        on:click={() => (castItemAmount += castItemStartAmount)}
        class="btn btn-primary"
      >
        Show more
      </button>
    {/if}
  </div>
{/if}
