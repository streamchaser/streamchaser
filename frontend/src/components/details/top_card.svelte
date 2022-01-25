<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { currentCountry } from "../../stores/country.js"
  import { currentGenres } from "../../stores/genres.js"
  import { inputQuery } from "../../stores/input.js"

  const INITIAL_OVERVIEW_LENGTH: number = 550
  const IMG_URL: string = "https://image.tmdb.org/t/p/original/"

  export let backdropPath: string
  export let posterPath: string
  export let title: string
  export let overview: string
  export let genres: []
  export let providers: []
  export let runtime: number
  export let imdbId: string
  export let releaseDate: string

  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH

  const changeGenreAndRedirectHome = (genre) => {
    $currentGenres = [genre]
    $inputQuery = ""
    window.location.href = "/"
  }

  const getFormattedRuntime = (minutes: number): string => {
    let hours = Math.floor(minutes / 60)
    let remainingMinutes = minutes - hours * 60
    if (hours) {
      return hours + "h " + remainingMinutes + "m"
    } else {
      return remainingMinutes + "m"
    }
  }
</script>

<div
  class="flex items-center px-4 py-10 bg-cover card bg-gray-500 shadow-md"
  style="background-image: url(&quot;{IMG_URL}{backdropPath}&quot;);e"
>
  <div
    class="card sm:card-side bg-gray-700 bg-opacity-90 bordered
                text-neutral-content shadow-md"
  >
    {#if posterPath}
      <figure class="pt-10 pr-10 pl-10 sm:p-6">
        <img
          src="{IMG_URL}{posterPath}"
          class="object-contain sm:max-h-96 w-full rounded-lg"
          alt={title}
        />
      </figure>
    {:else}
      <figure class="pt-10 pr-10 pl-10 sm:p-6">
        <div
          class="h-96 bg-primary-content object-contain sm:max-h-96 rounded-lg
                grid place-items-center"
        >
          <h2 class="w-64 text-center text-neutral-content text-lg">
            <strong>{title}</strong>
          </h2>
        </div>
      </figure>
    {/if}
    <div class="card-body max-w-md">
      <div class="flex justify-between">
        <h2 class="card-title">{title}</h2>
        {#if imdbId}
          <a href="https://www.imdb.com/title/{imdbId}">
            <div
              class="badge badge-secondary mx-2 transform
                                hover:contrast-75"
            >
              IMDb
            </div>
          </a>
        {/if}
      </div>
      {#if releaseDate && runtime}
        <h3 class="pb-3">
          <i>{new Date(releaseDate).getFullYear()} • {getFormattedRuntime(runtime)}</i>
        </h3>
      {:else if releaseDate}
        <h3 class="pb-3"><i>{new Date(releaseDate).getFullYear()}</i></h3>
      {:else if runtime}
        <h3 class="pb-3"><i>{getFormattedRuntime(runtime)}</i></h3>
      {/if}
      <ReadMore
        currentDescriptionLength={currentOverviewLength}
        mediaDescription={overview}
        initialDescriptionLength={INITIAL_OVERVIEW_LENGTH}
      />
      {#if genres}
        <div class="flex-wrap mt-2">
          {#each genres as genre}
            <div
              on:click={() => changeGenreAndRedirectHome(genre)}
              class="badge badge-primary mx-2 my-1 transform cursor-pointer
                                   hover:contrast-75"
            >
              {genre}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  {#if providers}
    {#if !providers.length}
      <div class="pt-5">
        <div class="badge badge-lg shadow-2xl">
          No providers in {$currentCountry}
        </div>
      </div>
    {:else}
      <div class="sm:flex sm:justify-center grid grid-cols-4 pt-5">
        {#each providers as provider}
          <div class="avatar tooltip" data-tip={provider.provider_name}>
            <div
              data-tip={provider.provider_name}
              class="mb-2 rounded-full w-20 h-20 ring ring-gray-700
                                ring-offset-base-100 ring-offset-2"
            >
              <img src="{IMG_URL}{provider.logo_path}" alt={provider.provider_name} />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
