<script lang="ts">
  import ReadMore from "./read_more.svelte"
  import { currentCountry } from "$lib/stores/country.js"
  import { currentGenres } from "$lib/stores/genres.js"
  import { inputQuery } from "$lib/stores/input.js"
  import { uniqueArray } from "$lib/utils"
  import { IMG_ORIGINAL, IMG_W1280, IMG_W500 } from "$lib/variables"

  const INITIAL_OVERVIEW_LENGTH: number = 550

  export let backdropPath: string
  export let posterPath: string
  export let title: string
  export let overview: string
  export let genres: string[]
  export let freeProviders: string[]
  export let flatrateProviders: string[]
  export let runtime: number
  export let imdbId: string
  export let releaseDate: string

  let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH

  const changeGenreAndRedirectHome = (genre: string) => {
    // Needs to replace the &'s for the multiselects to find it
    $currentGenres = [genre.replace(" & ", "%20%26%20")]
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
  class="flex items-center px-2 sm:mx-2 py-10 bg-cover card bg-base-100 rounded-box shadow-md"
  style="background-image: url(&quot;{IMG_W1280}{backdropPath}&quot;);e"
>
  <div
    class="card sm:card-side bg-neutral bg-opacity-90 bordered
                text-neutral-content shadow-md"
  >
    {#if posterPath}
      <figure class="pt-10 pr-10 pl-10 sm:p-6">
        <img
          src="{IMG_W500}{posterPath}"
          class="object-contain sm:max-h-96 w-full rounded-box"
          alt={title}
        />
      </figure>
    {:else}
      <figure class="pt-10 pr-10 pl-10 sm:p-6">
        <div
          class="h-96 bg-slate-100 object-contain sm:max-h-96 rounded-box
                grid place-items-center"
        >
          <h2 class="w-64 text-center text-gray-900 text-lg">
            <strong>{title}</strong>
          </h2>
        </div>
      </figure>
    {/if}
    <div class="card-body max-w-md">
      <div class="flex justify-between">
        <h2 class="card-title">{title}</h2>
        {#if imdbId}
          <a
            href="https://www.imdb.com/{imdbId.startsWith('tt')
              ? 'title'
              : 'name'}/{imdbId}"
          >
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

  {#if freeProviders || flatrateProviders}
    {#if !freeProviders.length && !flatrateProviders.length}
      <div class="pt-5">
        <div class="badge badge-lg shadow-2xl">
          No providers in {$currentCountry}
        </div>
      </div>
    {:else}
      <div class="sm:flex sm:justify-center grid grid-cols-4 pt-5">
        {#each uniqueArray(freeProviders.concat(flatrateProviders), "provider_id") as provider}
          <div class="avatar tooltip border-neutral" data-tip={provider.provider_name}>
            <div
              data-tip={provider.provider_name}
              class="mb-2 rounded-full w-20 h-20 ring ring-neutral
                                ring-offset-neutral ring-offset-2"
            >
              <img
                src="{IMG_ORIGINAL}{provider.logo_path}"
                alt={provider.provider_name}
              />
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>
