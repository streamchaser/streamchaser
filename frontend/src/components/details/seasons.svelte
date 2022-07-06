<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import MediaQuery from "svelte-media-query"
  import { IMG_W342, IMG_W500 } from "../../variables"

  export let seasons

  const INITIAL_OVERVIEW_LENGTH: number = 600

  let currentTab: number = 0
  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH

  const changeActiveTab = index => {
    currentTab = index
  }
</script>

<div class="container px-2">
  <div class="text-3xl p-4 flex justify-center">Seasons</div>
  <div class="tabs flex justify-center">
    {#each seasons as season, index}
      {#if index === currentTab}
        <div class="tab tab-bordered tab-active">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {:else}
        <div on:click={() => changeActiveTab(index)} class="tab tab-bordered">
          {season.name === "Specials"
            ? "S"
            : season.name.substr(season.name.indexOf(" ") + 1)}
        </div>
      {/if}
    {/each}
  </div>

  <div class="my-4 flex justify-center">
    {#each seasons as season, index}
      <MediaQuery query="(max-width: 1024px)" let:matches>
        {#if matches}
          {#if index === currentTab}
            <div class="card shadow-lg image-full w-auto sm:w-4/6 md:w-3/5 ">
              {#if season.poster_path}
                <figure>
                  <img
                    src="{IMG_W500}{season.poster_path}"
                    class="object-fit h-96"
                    alt={season.name}
                  />
                </figure>
              {:else}
                <figure>
                  <img
                    src="../../no_image_available.jpg"
                    class="object-fit h-72"
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
            </div>
          {/if}
        {/if}
      </MediaQuery>
      <MediaQuery query="(min-width: 1025px)" let:matches>
        {#if matches}
          {#if index === currentTab}
            <div class="card card-side bg-neutral-focus bordered lg:w-5/6 xl:w-3/5">
              {#if season.poster_path}
                <figure>
                  <img
                    src="{IMG_W342}{season.poster_path}"
                    class="object-fit h-96"
                    alt={season.name}
                  />
                </figure>
              {:else}
                <figure>
                  <img
                    src="../../no_image_available.jpg"
                    class="object-fit h-72"
                    alt="No poster available"
                  />
                </figure>
              {/if}
              <div class="mx-4 my-2">
                <div class="card-title">{season.name}</div>
                <div class="text-xl text-netural-content">
                  {season.air_date ? season.air_date.split("-")[0] : "No air date"}
                  | {season.episode_count} episodes
                </div>
                <div class="text-lg text-netural-content">
                  {season.air_date ? `Premiered on ${season.air_date}` : "Hasn't aired"}
                </div>
                &nbsp
                <ReadMore
                  currentDescriptionLength={currentOverviewLength}
                  mediaDescription={season.overview
                    ? season.overview
                    : "No season overview available."}
                  initialDescriptionLength={INITIAL_OVERVIEW_LENGTH}
                />
              </div>
            </div>
          {/if}
        {/if}
      </MediaQuery>
    {/each}
  </div>
</div>
