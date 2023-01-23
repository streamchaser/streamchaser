<script lang="ts">
  import { calculateAmountOfShownItems, hitProviderAmounts } from "$lib/utils"
  import { PYTHON_API } from "$lib/variables.js"
  import Select from "svelte-select"
  import MediaSearch from "$lib/components/media_search.svelte"
  import Head from "$lib/components/head.svelte"
  import {
    currentCountry,
    currentProviders,
    currentGenres,
    inputQuery,
    filters,
    sorting,
  } from "$lib/stores/preferences"
  import { totalFilterAmount } from "$lib/stores/stores"
  import { onMount } from "svelte"
  import type { Meilisearch } from "$lib/generated"
  import type { PageData } from "./$types"
  import { invalidateAll } from "$app/navigation"
  import { browser } from "$app/environment"

  export let data: PageData

  const SEARCH_URL = `${PYTHON_API}/search/`

  let input = ""
  let meilisearch: Meilisearch
  let providerAmounts: number[] = []
  let viewPortWidth: number
  let currentMediaAmount = 24
  let mediaStartAmount = 24

  $: $filters, $sorting, search()

  const search = async () => {
    // Builds the optional query for genres
    // Example: "?g=Action&g=Comedy&g=Drama"

    let query = ""
    for (let i = 0; i < $currentGenres.length; i++) {
      query += `&g=${$currentGenres[i].value}`
    }
    for (let i = 0; i < $currentProviders.length; i++) {
      query += `&p=${$currentProviders[i].value}`
    }

    if ($filters.tvChecked && $filters.movieChecked) {
    } else if ($filters.movieChecked) {
      query += "&t=movie"
    } else {
      query += "&t=tv"
    }

    if ($filters.minImdb) {
      query += `&min_imdb=${$filters.minImdb}`
    }

    if ($sorting.by.popularity) {
      query += `&popularity=${$sorting.asc ? "asc" : "desc"}`
    } else if ($sorting.by.releaseDate) {
      query += `&release_date=${$sorting.asc ? "asc" : "desc"}`
    } else if ($sorting.by.imdbRating) {
      query += `&imdb_rating=${$sorting.asc ? "asc" : "desc"}`
    }
    // Searches for all(*) if empty input
    // Empty input will only return media with providers
    const res =
      input !== ""
        ? await fetch(
            SEARCH_URL +
              input.replace(/[^\w\d\s\&]/g, " ") +
              "?c=" +
              $currentCountry +
              query +
              `&limit=${currentMediaAmount}`
          )
        : await fetch(
            SEARCH_URL +
              "*" +
              "?c=" +
              $currentCountry +
              query +
              `&limit=${currentMediaAmount}` +
              "&only_providers=true"
          )
    $inputQuery = input
    meilisearch = await res.json()
    providerAmounts = hitProviderAmounts(meilisearch.hits, $currentCountry)
  }

  $: if (browser && data.providers) {
    let selectedProviders = $currentProviders
    for (let i = 0; i < selectedProviders.length; i++) {
      if (
        !data.providers.map(v => v.provider_name).includes(selectedProviders[i].value)
      ) {
        selectedProviders.splice(i, 1)
        i--
      }
    }
    $currentProviders = selectedProviders
  }

  // Invalidates data (refetched) when the country changes
  // The browser check is because of the messy viewport logic
  $: if ($currentCountry && browser) {
    invalidateAll()
    search()
  }

  onMount(async () => {
    const inputField = document.getElementById("input-field") as HTMLInputElement

    setTimeout(() => {
      inputField.select()
    }, 20)

    if ($inputQuery) {
      input = $inputQuery
    }

    await search()
  })
</script>

<Head title="streamchaser" />

<div class="bg-neutral shadow-md card pb-2 pt-6 px-2 mx-2 sm:px-6">
  <div class="flex justify-between">
    <div class="indicator lg:hidden">
      {#if $totalFilterAmount}
        <span
          class="indicator-item indicator-top sm:indicator-start indicator-center badge badge-secondary"
          >{$totalFilterAmount}</span
        >
      {/if}
      <!-- Button to open drawer -->
      <label for="my-drawer-2" class="btn btn-primary mr-2 lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block w-6 h-6 stroke-current"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          /></svg
        >
      </label>
    </div>
    <!-- svelte-ignore a11y-autofocus -->
    <input
      id="input-field"
      type="text"
      placeholder="Search in {$currentCountry}"
      class="input input-bordered input-primary grow min-w-0 hover:border-primary-focus"
      bind:value={input}
      on:input={search}
      autofocus={viewPortWidth > 640}
    />
  </div>
  <div
    class="sm:grid sm:grid-cols-2 sm:gap-2 mt-2 mb-3"
    style="
             --borderRadius: var(--rounded-btn, .5rem);
             --background: hsl(var(--b1));
             --border: 1px solid hsl(var(--p));
             --borderFocusColor: hsl(var(--p));
             --borderHoverColor: hsl(var(--pf));
             --multiItemBG: hsl(var(--p));
             --multiItemColor: hsl(var(--pc));
             --multiItemActiveBG: hsl(var(--pf));
             --multiItemActiveColor: hsl(var(--bc));
             --clearSelectHoverColor: hsl(var(--pf));
             --itemIsActiveBG: hsl(var(--pc));
             --itemColor: hsl(var(--nc));
             --listBackground: hsl(var(--n));
             --itemHoverBG: hsl(var(--p));
             --itemHoverColor: hsl(var(--pc));
             --inputColor: hsl(var(--bc));
             --clearSelectFocusColor: hsl(var(--p));
              "
  >
    <div class="mb-2 sm:mb-0">
      <Select
        on:select={e => {
          $currentGenres = e.detail ? e.detail : []
          search()
        }}
        on:clear={e => {
          $currentGenres = e.detail
            ? $currentGenres.splice($currentGenres.indexOf(e.detail.value))
            : []
        }}
        value={$currentGenres.length ? $currentGenres : null}
        items={data.genres}
        isMulti={true}
        placeholder="Select genres..."
      />
    </div>
    <div>
      <Select
        on:select={e => {
          $currentProviders = e.detail ? e.detail : []
          search()
        }}
        on:clear={e => {
          $currentProviders = e.detail
            ? $currentProviders.splice($currentProviders.indexOf(e.detail.value))
            : []
        }}
        value={$currentProviders.length ? $currentProviders : null}
        items={data.providers.map(v => v.provider_name)}
        isMulti={true}
        placeholder="Select providers..."
      />
    </div>
  </div>
</div>
<MediaSearch
  {meilisearch}
  {providerAmounts}
  currentProviders={$currentProviders}
  bind:currentMediaAmount
  {input}
  currentGenres={$currentGenres}
  {search}
  {mediaStartAmount}
/>
