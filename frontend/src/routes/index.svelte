<script lang="ts">
  import { calculateAmountOfShownItems } from "../utils"
  import { GO_API, PYTHON_API } from "../variables.js"
  import Select from "svelte-select"
  import MediaSearch from "../components/media_search.svelte"
  import Filters from "../components/filters.svelte"
  import { currentCountry } from "../stores/country.js"
  import { currentProviders } from "../stores/providers.js"
  import { currentGenres } from "../stores/genres"
  import { inputQuery } from "../stores/input"
  import { chosenTheme } from "../stores/theme.js"
  import { filters } from "../stores/filters.js"
  import { onMount } from "svelte"
  import DT from "daisyui/colors/themes.js"
  import type { Genre, Media, Meilisearch } from "../types"

  const SEARCH_URL = `${PYTHON_API}/search/`
  const GENRE_URL = `${GO_API}/genres/`
  const PROVIDER_URL = `${PYTHON_API}/providers/`
  const INPUT_TIMER = 200

  let input = ""
  let timer: NodeJS.Timeout
  let meilisearch: Meilisearch
  let providerAmounts: number[] = []
  let genres: Genre[]
  let activeProviders = [""]
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
      query += `&t=movie`
    } else {
      query += `&t=tv`
    }

    if (!$filters.showNoProviders) {
      query += `&only_providers=true`
    }
    // Searches for all(*) if empty input
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
              `&limit=${currentMediaAmount}`
          )
    $inputQuery = input
    meilisearch = await res.json()
    hitProviderAmounts(meilisearch.hits)
  }

  const fetchProviders = async () => {
    const res = await fetch(PROVIDER_URL + $currentCountry)
    activeProviders = await res.json()
  }

  const fetchGenres = async () => {
    const res = await fetch(GENRE_URL)
    genres = await res.json()
  }

  const resetProviders = () => {
    $currentProviders = []
  }

  //TODO: This should be done prettier
  let firstLoadCompleted = false
  $: if ($currentCountry) {
    if (firstLoadCompleted) {
      resetProviders()
      fetchProviders()
      setViewportToDefault()
      search()
    }
    firstLoadCompleted = true
  }

  onMount(async () => {
    const inputField = document.getElementById("input-field") as HTMLInputElement

    setTimeout(function () {
      inputField.select()
    }, 20)

    if ($inputQuery !== "") {
      input = $inputQuery
    }

    await Promise.all([fetchGenres(), fetchProviders(), search()])
  })
</script>

<svelte:head>
  <title>Streamchaser</title>
</svelte:head>

<div class="bg-neutral shadow-md sm:rounded-lg pb-2 pt-6 px-2 sm:px-6">
  <div class="form-control flex flex-row">
    <input
      id="input-field"
      type="text"
      placeholder="Search in {$currentCountry}"
      class="input input-bordered input-primary grow"
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
             --background: {DT[`[data-theme=${$chosenTheme}]`]['base-100']};
             --border: 1px solid {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --borderFocusColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --borderHoverColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemBG: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemColor: {DT[`[data-theme=${$chosenTheme}]`]['primary-content']};
             --multiItemActiveBG: {DT[`[data-theme=${$chosenTheme}]`]['primary-focus']};
             --multiItemActiveColor: {DT[`[data-theme=${$chosenTheme}]`][
      'primary-content'
    ]};
             --clearSelectHoverColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --itemIsActiveBG: {DT[`[data-theme=${$chosenTheme}]`]['primary-content']};
             --itemColor: {DT[`[data-theme=${$chosenTheme}]`]['text-secondary']};
             --listBackground: {DT[`[data-theme=${$chosenTheme}]`]['neutral']};
             --itemHoverBG: {DT[`[data-theme=${$chosenTheme}]`]['neutral-focus']};
             --inputColor: {DT[`[data-theme=${$chosenTheme}]`]['text-primary']};
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
        items={genres}
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
        items={activeProviders}
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
