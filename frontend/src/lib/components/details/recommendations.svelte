<script lang="ts">
  import type { Recommendation } from "$lib/types"
  import MediaCard from "$lib/components/media_card.svelte"
  import { Splide, SplideSlide } from "@splidejs/svelte-splide"
  import "@splidejs/svelte-splide/css"
  import { onMount } from "svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import { lookupMedia } from "$lib/utils"

  export let recommendations: Recommendation[]

  let loadedPage: boolean

  onMount(() => {
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="pt-5 pb-5 text-3xl text-center">Recommendations</h1>
  {#await lookupMedia(recommendations, $currentCountry)}
    <Spinner timeout={false} />
  {:then lookup}
    <div class="px-2 mx-2">
      <Splide
        options={{
          type: "loop",
          lazyLoad: "sequential",
          pagination: false,
          drag: "free",
          snap: true,
          focus: "center",
          start: 1,
          mediaQuery: "min",
          breakpoints: {
            1536: { perPage: 7 },
            1280: { perPage: 6 },
            1024: { perPage: 5 },
            768: { perPage: 4 },
            576: { perPage: 3 },
            0: { perPage: 2 },
          },
        }}
      >
        {#each lookup.meilisearch.hits as hit, index}
          {#if hit.poster_path}
            <SplideSlide>
              <div class="p-1">
                <MediaCard
                  media={hit}
                  mediaIndex={index}
                  providerAmounts={lookup.providerAmounts}
                />
              </div>
            </SplideSlide>
          {/if}
        {/each}
      </Splide>
    </div>
  {/await}
{/if}
