<script lang="ts">
  import type { Recommendation } from "$lib/types"
  import { register } from "swiper/element/bundle"
  import { Navigation } from "swiper"
  import MediaCard from "$lib/components/media_card.svelte"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { onMount } from "svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import { lookupMedia } from "$lib/utils"

  export let recommendations: Recommendation[]

  let loadedPage: boolean

  register()

  onMount(() => {
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  {#await lookupMedia(recommendations, $currentCountry)}
    <Spinner timeout={false} />
  {:then lookup}
    <swiper-container
      px-2
      mx-2
      style="
        --swiper-navigation-color: text-blue-500;
        --swiper-navigation-size: 25px;
      "
      grab-cursor={true}
      resistance={false}
      preload-images={false}
      lazy={{
        enabled: true,
        checkInView: true,
        loadPrevNext: true,
      }}
      watch-slides-progress={true}
      breakpoints={{
        0: { slidesPerView: 2 },
        576: { slidesPerView: 3 },
        640: { slidesPerView: 3.3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
        1536: { slidesPerView: 7 },
      }}
      modules={[Navigation]}
      loop={true}
      free-mode={{
        enabled: true,
        sticky: true,
      }}
      navigation={true}
      touch-events-target={"container"}
      touch-start-prevent-default="true"
    >
      {#each lookup.meilisearch.hits as hit, index}
        {#if hit.poster_path}
          <swiper-slide>
            <MediaCard
              media={hit}
              mediaIndex={index}
              providerAmounts={lookup.providerAmounts}
            />
            <div class="swiper-lazy-preloader" />
          </swiper-slide>
        {/if}
      {/each}
    </swiper-container>
  {/await}
{/if}
