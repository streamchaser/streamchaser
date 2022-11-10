<script lang="ts">
  import { calculateAmountOfShownItems } from "$lib/utils"
  import { PYTHON_API } from "$lib/variables.js"
  import Select from "svelte-select"
  import MediaSearch from "$lib/components/media_search.svelte"
  import Filters from "$lib/components/filters.svelte"
  import { currentCountry } from "$lib/stores/country.js"
  import { currentProviders } from "$lib/stores/providers.js"
  import { currentGenres } from "$lib/stores/genres"
  import { inputQuery } from "$lib/stores/input"
  import { chosenTheme } from "$lib/stores/theme.js"
  import { filters } from "$lib/stores/filters.js"
  import { sorting } from "$lib/stores/sorting.js"
  import { onMount } from "svelte"
  import type { Media, Meilisearch } from "$lib/types"
  import type { PageData } from "./$types"
  import { invalidateAll } from "$app/navigation"
  import { browser } from "$app/environment"

  export let data: PageData

  const SEARCH_URL = `${PYTHON_API}/search/`
  const INPUT_TIMER = 200

  let input = ""
  let timer: NodeJS.Timeout
  let meilisearch: Meilisearch
  let providerAmounts: number[] = []
  let viewPortWidth: number
  let currentMediaAmount: number
  let mediaStartAmount: number

  // run search if we haven't received input in the last 200ms
  const debounceInput = () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      setViewportToDefault()
      search()
    }, INPUT_TIMER)
  }

  const hitProviderAmounts = (searchHits: Media[]) => {
    providerAmounts = []
    searchHits.forEach(hit => {
      providerAmounts.push(hit.providers.length)
    })
  }

  const setViewportToDefault = () => {
    viewPortWidth = window.visualViewport.width
    currentMediaAmount = calculateAmountOfShownItems({
      width: viewPortWidth,
      xxl: 35,
      xl: 30,
      lg: 25,
      md: 20,
      sm: 15,
      mobile: 10,
    })
    mediaStartAmount = currentMediaAmount
  }

  const search = async () => {
    // Builds the optional query for genres
    // Example: "?g=Action&g=Comedy&g=Drama"

    if (!currentMediaAmount) {
      setViewportToDefault()
    }

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

    if (!$filters.showNoProviders) {
      query += "&only_providers=true"
    }

    if ($sorting.by.popularity) {
      query += `&popularity=${$sorting.asc ? "asc" : "desc"}`
    } else if ($sorting.by.releaseDate) {
      query += `&release_date=${$sorting.asc ? "asc" : "desc"}`
    }
    // Searches for all(*) if empty input
    // Empty input will only return media with providers
    const res =
      input !== ""
        ? await fetch(
            SEARCH_URL +
              input +
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
    hitProviderAmounts(meilisearch.hits)
  }

  // Invalidates data(refetched) when the country changes
  // The browser check is becuase of the messy viewport logic
  $: if ($currentCountry && browser) {
    $currentProviders = []
    setViewportToDefault() // TODO: There must be a nicer way
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

<svelte:head>
  <title>Streamchaser</title>
</svelte:head>

<div class="bg-neutral shadow-md card pb-2 pt-6 px-2 sm:px-6">
  <div class="flex justify-between">
    <input
      id="input-field"
      type="text"
      placeholder="Search in {$currentCountry}"
      class="input input-bordered input-primary grow min-w-0 hover:border-primary-focus"
      bind:value={input}
      on:input={debounceInput}
      autofocus={viewPortWidth <= 640 ? false : true}
    />
    <Filters {search} />
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
             --itemIsActiveBG: hsl(var(--pc))
             --itemColor: hsl(var(--sc));
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
          setViewportToDefault()
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
          setViewportToDefault()
          search()
        }}
        on:clear={e => {
          $currentProviders = e.detail
            ? $currentProviders.splice($currentProviders.indexOf(e.detail.value))
            : []
        }}
        value={$currentProviders.length ? $currentProviders : null}
        items={data.providers}
        isMulti={true}
        placeholder="Select providers..."
      />
    </div>
  </div>
</div>
<MediaSearch
  {meilisearch}
  {providerAmounts}
  currentCountry={$currentCountry}
  currentProviders={$currentProviders}
  bind:currentMediaAmount
  {input}
  currentGenres={$currentGenres}
  {search}
  {mediaStartAmount}
/>
