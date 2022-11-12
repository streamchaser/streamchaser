<script lang="ts">
  import { mediaIdToUrlConverter } from "$lib/utils"
  import type { Recommendation } from "../types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Navigation, Lazy } from "swiper"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { IMG_W342 } from "../../variables"
  import { onMount } from "svelte"

  export let recommendations: Recommendation[]
  export let mediaType: string

  let loadedPage: boolean

  onMount(() => {
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  <div class="bg-neutral rounded-box swiper-container px-2 mx-2">
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
      spaceBetween={15}
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
      touchEventsTarget={{ touchEventsTarget: "container" }}
    >
      {#each recommendations as recommendation}
        {#if recommendation.poster_path}
          <SwiperSlide>
            <a
              href={mediaIdToUrlConverter(recommendation.id, mediaType)}
              target="_self"
              class="p-1 swiper-lazy aspect-[342/513]"
              data-sveltekit-prefetch
            >
              <img
                data-src="{IMG_W342}{recommendation.poster_path}"
                class="h-72 w-full rounded-box hover:contrast-75 hover:ring-2 ring-primary swiper-lazy"
                alt={recommendation.title}
              />
            </a>
          </SwiperSlide>
        {/if}
      {/each}
    </Swiper>
  </div>
{/if}
