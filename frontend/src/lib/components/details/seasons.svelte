<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { Splide, SplideSlide } from "@splidejs/svelte-splide"
  import "@splidejs/svelte-splide/css"
  import { IMG_W342 } from "$lib/variables"
  import type { TV } from "$lib/generated"

  export let seasons: TV["seasons"]
</script>

<div class="container p-2">
  <div class="flex justify-center p-4 text-3xl">Seasons</div>
  <Splide
    options={{
      lazyLoad: "sequential",
      drag: "free",
      snap: true,
      focus: "center",
      pagination: false,
      gap: "1rem",
      start: 1,
      omitEnd: true,
      mediaQuery: "min",
      breakpoints: {
        1536: { perPage: 6 },
        1280: { perPage: 5 },
        1024: { perPage: 4 },
        768: { perPage: 3 },
        640: { perPage: 2 },
        480: { perPage: 1 },
        320: { perPage: 1 },
      },
    }}
  >
    {#each seasons as season}
      <SplideSlide class="splide-seasons">
        <div class="card h-[350px] aspect-[342/513] bg-base-100 image-full">
          {#if season.poster_path}
            <figure>
              <img
                data-splide-lazy="{IMG_W342}{season.poster_path}"
                alt={season.name}
              />
            </figure>
          {:else}
            <figure class="bg-base-100" />
          {/if}
          <div class="overflow-auto p-4 card-body">
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
      </SplideSlide>
    {/each}
  </Splide>
</div>

<style global>
  @media (min-width: 320px) {
    :global(.splide-seasons) {
      display: flex;
      justify-content: center;
    }
  }
</style>
