<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { calculateAmountOfShownItems } from "../../utils"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Navigation } from "swiper"
  import "swiper/css"
  import "swiper/css/free-mode"
  import "swiper/css/navigation"

  export let seasons

  const INITIAL_OVERVIEW_LENGTH: number = 600

  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"

  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH
  let slidesPerView = calculateAmountOfShownItems({
    width: window.visualViewport.width,
    xxl: 3.8,
    xl: 3,
    lg: 2.5,
    md: 2,
    sm: 1.7,
    mobile: 1,
  })
</script>

<div class="text-3xl p-4 flex justify-center">Seasons</div>

<div class="px-2 swiper-container">
  <Swiper
    spaceBetween={15}
    {slidesPerView}
    navigation={true}
    modules={[Navigation]}
    initialSlide={seasons[0].name === "Specials" ? 1 : 0}
  >
    {#each seasons as season, index}
      <SwiperSlide>
        <div class="card h-[576px] md:w-86 xl:w-96 bg-base-100 image-full">
          {#if season.poster_path}
            <figure>
              <img
                src="{LOW_RES_IMG_URL}{season.poster_path}"
                class="object-fit"
                alt={season.name}
              />
            </figure>
          {:else}
            <figure class="bg-base-100" />
          {/if}
          <div class="card-body">
            <div class="card-title">{season.name}</div>
            <div class="text-xl text-neutral-content">
              {season.air_date ? season.air_date.split("-")[0] : "No air date"}
              | {season.episode_count} episodes
            </div>
            <div class="text-lg text-neutral-content">
              {season.air_date ? `Premiered on ${season.air_date}` : "Hasn't aired"}
            </div>
            &nbsp
            <div class="text-neutral-content">
              {season.overview ? season.overview : "No season overview available."}
            </div>
          </div>
        </div>
      </SwiperSlide>
    {/each}
  </Swiper>
</div>
