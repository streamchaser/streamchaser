<script lang="ts">
  import { calculateAmountOfShownItems, mediaIdToUrlConverter } from "../../utils"
  import type { Recommendation } from "../types"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import "swiper/css"

  let slidesPerView = calculateAmountOfShownItems({
    width: window.visualViewport.width,
    xxl: 7,
    xl: 6,
    lg: 5,
    md: 4,
    sm: 3,
    mobile: 2,
  })

  const IMG_URL = "https://image.tmdb.org/t/p/original/"

  export let recommendations: Recommendation[]
  export let mediaType: string
</script>

{#if recommendations.length}
  <h1 class="text-center text-3xl pt-5 pb-5">Recommendations</h1>
  <div class="bg-neutral rounded-lg">
    <Swiper spaceBetween={15} {slidesPerView}>
      {#each recommendations as recommendation}
        {#if recommendation.poster_path}
          <SwiperSlide>
            <a
              href={mediaIdToUrlConverter(recommendation.id, mediaType)}
              target="_self"
              class="p-1"
            >
              <img
                src="{IMG_URL}{recommendation.poster_path}"
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
