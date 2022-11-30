<script lang="ts">
  import { fade } from "svelte/transition"
  import type { Genre } from "../types"
  import { filters } from "$lib/stores/preferences"

  export let currentProviders: { index: number; label: string; value: string }[]
  export let currentGenres: Genre[]
  export let input: string
</script>

<div in:fade={{ duration: 500 }} class="flex flex-col mt-20">
  <div class="m-auto text-center max-w-md">
    <p>No results for:</p>
    <p><b><i>{input ? input : "<No input>"}</i></b></p>
    {#if currentGenres.length > 0}
      <p class="pt-2">Genres:</p>
      {#each currentGenres as genre}
        <div class="badge mx-1">{genre.label}</div>
      {/each}
      <p class="text-xs pt-1"><i>Consider using less genres</i></p>
    {/if}
    {#if currentProviders.length > 0}
      <p class="pt-2">Provider(s):</p>
      {#each currentProviders as provider}
        <div class="badge mx-1">{provider.label}</div>
      {/each}
      <p class="text-xs pt-1">
        <i>Consider adding more providers or removing all</i>
      </p>
    {/if}
    {#if Object.values($filters).includes(false)}
      <p class="pt-2">With filter(s):</p>
      {#if !$filters.movieChecked}
        <div class="badge mx-1">No Movies</div>
      {/if}
      {#if !$filters.tvChecked}
        <div class="badge mx-1">No TV Shows</div>
      {/if}
      <p class="text-xs pt-1">
        <i>Consider removing the filter(s)</i>
      </p>
    {/if}
  </div>
</div>
