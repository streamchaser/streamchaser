<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { calculateAmountOfShownItems } from "../../utils"
  import { Swiper, SwiperSlide } from "swiper/svelte"
  import "swiper/css"

  export let seasons

  const INITIAL_OVERVIEW_LENGTH: number = 600

  const LOW_RES_IMG_URL: string = "https://image.tmdb.org/t/p/w500/"

  let currentTab: number = 0
  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH
  let slidesPerView = calculateAmountOfShownItems({
    width: window.visualViewport.width,
    xxl: 7,
    xl: 6,
    lg: 5,
    md: 4,
    sm: 3,
    mobile: 2,
  })

  const changeActiveTab = index => {
    currentTab = index
  }
</script>

<div class="container px-2">
  <div class="text-3xl p-4 flex justify-center">Seasons</div>
  <div class="tabs md:flex sm:justify-center m-mx">
    {#each seasons as season, index}
      {#if index === currentTab}
        <div class="tab tab-bordered tab-lg tab-active">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {:else}
        <div on:click={() => changeActiveTab(index)} class="tab tab-lg tab-bordered">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {/if}
    {/each}
  </div>

  <div class="my-4 flex justify-center">
    {#each seasons as season, index}
      {#if season.poster_path}
        <figure>
          <img
            src="{LOW_RES_IMG_URL}{season.poster_path}"
            class="object-fit rounded-lg"
            alt={season.name}
          />
        </figure>
      {:else}
        <figure>
          <img
            src="../static/no_image_available.jpg"
            class="object-fit rounded-lg"
            alt="No poster available"
          />
        </figure>
      {/if}
      <div class="card-body">
        <div class="card-title">{season.name}</div>
        <div class="text-xl text-netural-content">
          {season.air_date ? season.air_date.split("-")[0] : "No air date"}
          | {season.episode_count} episodes
        </div>
        <div class="text-lg text-netural-content">
          {season.air_date ? `Premiered on ${season.air_date}` : "Hasn't aired"}
        </div>
        &nbsp
        <div class="text-netural-content">
          {season.overview ? season.overview : "No season overview available."}
        </div>
      </div>
    {/each}
  </div>
</div>
