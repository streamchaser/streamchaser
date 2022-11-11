<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import { Navigation, Lazy } from "swiper"
  import { IMG_W342 } from "$lib/variables"
  import "swiper/css"
  import "swiper/css/free-mode"
  import "swiper/css/navigation"

  export let seasons
</script>

<div class="container p-2">
  <div class="text-3xl p-4 flex justify-center">Seasons</div>
  <div class="swiper-container cursor-pointer">
    <Swiper
      preloadImages={false}
      lazy={{
        enabled: true,
        checkInView: true,
        loadPrevNext: true,
      }}
      watchSlidesProgress={true}
      style="
              --swiper-navigation-color: text-blue-500;
              --swiper-navigation-size: 25px;
            "
      breakpoints={{
        0: { slidesPerView: 1.5 },
        400: { slidesPerView: 1.6 },
        650: { slidesPerView: 2.5 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
        1535: { slidesPerView: 6 },
      }}
      navigation={true}
      modules={[Navigation, Lazy]}
      initialSlide={seasons[0].name === "Specials" ? 1 : 0}
    >
      {#each seasons as season, index}
        <SwiperSlide>
          <div
            class="card h-[350px] aspect-[342/513] bg-base-100 image-full swiper-lazy"
          >
            {#if season.poster_path}
              <figure>
                <img
                  data-src="{IMG_W342}{season.poster_path}"
                  class="swiper-lazy"
                  alt={season.name}
                />
                <div class="swiper-lazy-preloader-white" />
              </figure>
            {:else}
              <figure class="bg-base-100" />
            {/if}
            <div class="card-body overflow-auto p-4">
              <div class="card-title">{season.name}</div>
              <div class="text-xl text-neutral-content">
                {season.air_date ? season.air_date.split("-")[0] : "No air date"}
                | {season.episode_count} episodes
              </div>
              <div class="text-lg text-neutral-content">
                {season.air_date ? `Premiered ${season.air_date}` : "Hasn't aired"}
              </div>
              <div class="pt-2 text-neutral-content">
                {#if season.overview}
                  <ReadMore
                    currentDescriptionLength={150}
                    mediaDescription={season.overview}
                    initialDescriptionLength={150}
                  />
                {:else}
                  No season overview available.
                {/if}
              </div>
            </div>
          </div>
        </SwiperSlide>
      {/each}
    </Swiper>
  </div>
</div>
