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
  <h1 class="text-center text-3xl pt-5">Cast</h1>
  <div
    class="grid grid-cols-3 2xl:grid-cols-9 xl:grid-cols-8 lg:grid-cols-7
                md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4"
  >
    {#each cast.slice(0, castItemAmount) as person}
      {#if person.profile_path}
        <a
          href={mediaIdToUrlConverter("p" + person.id)}
          data-sveltekit-preload-data
          class="card compact bordered shadow-md bg-neutral
                            hover:contrast-75 hover:ring-2 ring-primary"
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
  <div class="flex space-x-1 justify-center pt-5">
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
