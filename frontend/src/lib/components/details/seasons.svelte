<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { Navigation } from "swiper"
  import { register } from "swiper/element/bundle"
  import { IMG_W342 } from "$lib/variables"
  import "swiper/css"
  import "swiper/css/free-mode"
  import "swiper/css/navigation"
  import type { TV } from "$lib/generated"

  register()

  export let seasons: TV["seasons"]
</script>

<div class="container p-2">
  <div class="text-3xl p-4 flex justify-center">Seasons</div>
  <swiper-container
    grab-cursor={true}
    resistance={false}
    free-mode={true}
    lazy={{
      enabled: true,
      checkInView: true,
      loadPrevNext: true,
    }}
    watchs-slides-progress={true}
    style="
              --swiper-navigation-color: text-blue-500;
              --swiper-navigation-size: 25px;
            "
    space-between={10}
    breakpoints={{
      320: { slidesPerView: 1.3 },
      360: { slidesPerView: 1.5 },
      480: { slidesPerView: 2 },
      640: { slidesPerView: 2.5 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
      1280: { slidesPerView: 5 },
      1536: { slidesPerView: 6 },
    }}
    navigation={true}
    modules={[Navigation]}
    initial-slide={seasons[0].name === "Specials" ? 1 : 0}
  >
    {#each seasons as season}
      <swiper-slide>
        <div class="card h-[350px] aspect-[342/513] bg-base-100 image-full swiper-lazy">
          {#if season.poster_path}
            <figure>
              <img
                src="{IMG_W342}{season.poster_path}"
                class="swiper-lazy"
                alt={season.name}
                loading="lazy"
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
      </swiper-slide>
    {/each}
  </swiper-container>
</div>
