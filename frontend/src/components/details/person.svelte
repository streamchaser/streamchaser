<script lang="ts">
  import { mediaIdToUrlConverter } from "../../utils"

  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"
  const SHOW_BUTTON_AMOUNT: number = 18
  const CAST_ITEM_START_AMOUNT: number = 9

  export let cast

  let castItemAmount: number = 9
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
          href={mediaIdToUrlConverter(person.id, "person")}
          class="card compact bordered shadow-md bg-neutral
                            hover:contrast-75 hover:ring-2 ring-primary"
        >
          <figure>
            <img src="{LOW_RES_IMG_URL}{person.profile_path}" alt={person.name} />
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
    {#if castItemAmount > CAST_ITEM_START_AMOUNT}
      <button
        on:click={() => (castItemAmount = castItemAmount - SHOW_BUTTON_AMOUNT)}
        class="btn"
      >
        Show less
      </button>
    {/if}
    {#if castItemAmount < cast.length}
      <button
        on:click={() => (castItemAmount = castItemAmount + SHOW_BUTTON_AMOUNT)}
        class="btn btn-primary"
      >
        Show more
      </button>
    {/if}
  </div>
{/if}
