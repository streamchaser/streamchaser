<script lang="ts">
  import { calculateAmountOfShownItems, mediaIdToUrlConverter } from "../../utils"
  import type { Recommendation } from "../types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { IMG_W342 } from "../../variables"
  import { onMount } from "svelte"

  export let recommendations: Recommendation[]
  export let mediaType: string

  let loadedPage: boolean
  let slidesPerView: number

  // TODO: Make this happen in a less insane way
  onMount(() => {
    slidesPerView = calculateAmountOfShownItems({
      width: window.visualViewport.width,
      xxl: 7,
      xl: 6,
      lg: 5,
      md: 4,
      sm: 3,
      mobile: 2,
    })
    loadedPage = true
  })
</script>

{#if recommendations.length && loadedPage}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  <div class="bg-neutral sm:rounded-lg swiper-container">
    <Swiper
      spaceBetween={15}
      {slidesPerView}
      loop={true}
      freemode={true}
      touchEventsTarget={{ touchEventsTarget: "container" }}
    >
      {#each recommendations as recommendation}
        {#if recommendation.poster_path}
          <SwiperSlide>
            <a
              href={mediaIdToUrlConverter(recommendation.id, mediaType)}
              target="_self"
              class="p-1"
              data-sveltekit-prefetch
            >
              <img
                src="{IMG_W342}{recommendation.poster_path}"
                class="h-72 w-full rounded-lg hover:contrast-75 hover:ring-2 ring-primary"
                alt={recommendation.title}
              />
            </a>
          </SwiperSlide>
        {/if}
      {/each}
    </Swiper>
  </div>
{/if}
