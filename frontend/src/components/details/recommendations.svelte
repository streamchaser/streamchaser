<script lang="ts">
  import { calculateAmountOfShownItems, mediaIdToUrlConverter } from "../../utils"
  import type { Recommendation } from "../types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Mousewheel, FreeMode } from "swiper"
  import "swiper/css"
  import "swiper/css/free-mode"
  import { IMG_W342 } from "../../variables"

  let slidesPerView = calculateAmountOfShownItems({
    width: window.visualViewport.width,
    xxl: 7,
    xl: 6,
    lg: 5,
    md: 4,
    sm: 3,
    mobile: 2,
  })

  export let recommendations: Recommendation[]
  export let mediaType: string
</script>

{#if recommendations.length}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  <div class="bg-neutral rounded-lg swiper-container">
    <Swiper
      spaceBetween={15}
      {slidesPerView}
      loop={true}
      freemode={true}
      mousewheel={true}
      modules={[FreeMode, Mousewheel]}
      touchEventsTarget={{ touchEventsTarget: "container" }}
    >
      {#each recommendations as recommendation}
        {#if recommendation.poster_path}
          <SwiperSlide>
            <a
              href={mediaIdToUrlConverter(recommendation.id, mediaType)}
              target="_self"
              class="p-1"
            >
              <img
                src="{IMG_W342}{recommendation.poster_path}"
                class="h-80 rounded-lg hover:contrast-75 hover:ring-2 ring-primary"
                alt={recommendation.title}
              />
            </a>
          </SwiperSlide>
        {/if}
      {/each}
    </Swiper>
  </div>
{/if}
