<script lang="ts">
  import { calculateAmountOfShownItems } from "../utils"
  import { variables } from "../variables.js"
  import Select from "svelte-select"
  import MediaSearch from "../components/media_search.svelte"
  import { currentCountry } from "../stores/country.js"
  import { currentProviders } from "../stores/providers.js"
  import { currentGenres } from "../stores/genres"
  import { inputQuery } from "../stores/input"
  import { chosenTheme } from "../stores/theme.js"
  import { onMount } from "svelte"
  import DT from "daisyui/colors/themes.js"
  import type { Genre, Media, Meilisearch } from "../types"

  const SEARCH_URL = `${variables.apiPath}/search/`
  const GENRE_URL = `${variables.apiPath}/genres/`
  const PROVIDER_URL = `${variables.apiPath}/providers/`
  const INPUT_TIMER = 200

  let mediaStartAmount: number
  let currentMediaAmount: number

  let input = ""
  let timer: NodeJS.Timeout
  let meilisearch: Meilisearch
  let providerAmounts: number[] = []
  let genres: Genre[]
  let activeProviders = [""]

  // run search if we haven't received input in the last 200ms
  const debounceInput = () => {
    currentMediaAmount = mediaStartAmount
    clearTimeout(timer)
    timer = setTimeout(() => {
      search()
    }, INPUT_TIMER)
  }

  const hitProviderAmounts = (searchHits: Media[]) => {
    providerAmounts = []
    searchHits.forEach(hit => {
      providerAmounts.push(hit.providers.length)
    })
  }

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
      search()
    }
    firstLoadCompleted = true
  }

  onMount(async () => {
    const inputField = document.getElementById("input-field") as HTMLInputElement
    const VIEWPORT_WIDTH = window.visualViewport.width
    currentMediaAmount = calculateAmountOfShownItems(VIEWPORT_WIDTH)
    mediaStartAmount = calculateAmountOfShownItems(VIEWPORT_WIDTH)

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

<div class="bg-neutral shadow-md sm:rounded-lg pb-2 pt-6 px-6">
  <div class="form-control">
    <input
      id="input-field"
      type="text"
      placeholder="Search in {$currentCountry}"
      class="input input-primary input-bordered"
      bind:value={input}
      on:input={debounceInput}
      autofocus
    />
  </div>
  <div
    class="sm:grid sm:grid-cols-2 sm:gap-2 mt-2 mb-3"
    style="

             --borderRadius: var(--rounded-btn, .5rem);
             --background: {DT[`[data-theme=${$chosenTheme}]`]['base-100']};
             --border: 1px solid {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --borderFocusColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --borderHoverColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --itemIsActiveColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemActiveColor: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemBG: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemActiveBG: {DT[`[data-theme=${$chosenTheme}]`]['primary-focus']};
             --multiItemActiveColor: {DT[`[data-theme=${$chosenTheme}]`][
      'primary-accent'
    ]};
             --itemIsActiveBG: {DT[`[data-theme=${$chosenTheme}]`]['neutral']}
             --clearSelectHoverColor: {DT[`[data-theme=${$chosenTheme}]`][
      'base-content'
    ]};
             --listBackground: {DT[`[data-theme=${$chosenTheme}]`]['neutral']};
             --itemHoverBG: {DT[`[data-theme=${$chosenTheme}]`]['primary']};
             --inputColor: {DT[`[data-theme=${$chosenTheme}]`]['primary-content']}
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
        items={genres}
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
  mediaStartAmount={mediaStartAmount}
  bind:currentMediaAmount
  {input}
  currentGenres={$currentGenres}
  {search}
/>
