<script lang="ts">
  import type { Recommendation } from "$lib/types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Navigation, Lazy } from "swiper"
  import MediaCard from "$lib/components/media_card.svelte"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { onMount } from "svelte"
  import { currentCountry } from "$lib/stores/preferences"
  import Spinner from "$lib/components/loading/spinner.svelte"
  import { lookupMedia } from "$lib/utils"

  export let recommendations: Recommendation[]
  export let mediaType: string

  let loadedPage: boolean

  onMount(() => {
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  {#await lookupMedia(recommendations, $currentCountry)}
    <Spinner timeout={false} />
  {:then lookup}
    <div class="swiper-container px-2 mx-2">
      <Swiper
        style="
        --swiper-navigation-color: text-blue-500;
        --swiper-navigation-size: 25px;
      "
        grabCursor={true}
        resistance={false}
        preloadImages={false}
        lazy={{
          enabled: true,
          checkInView: true,
          loadPrevNext: true,
        }}
        watchSlidesProgress={true}
        breakpoints={{
          0: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          640: { slidesPerView: 3.3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
          1536: { slidesPerView: 7 },
        }}
        modules={[Navigation, Lazy]}
        loop={true}
        navigation={true}
        freeMode={true}
        touchEventsTarget={"container"}
      >
        {#each lookup.meilisearch.hits as hit, index}
          {#if hit.poster_path}
            <SwiperSlide>
              <div class="p-1 swiper-lazy">
                <MediaCard
                  media={hit}
                  mediaIndex={index}
                  providerAmounts={lookup.providerAmounts}
                />
              </div>
            </SwiperSlide>
          {/if}
        {/each}
      </Swiper>
    </div>
  {/await}
{/if}
