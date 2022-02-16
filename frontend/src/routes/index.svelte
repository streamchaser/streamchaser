<script lang="ts">
  import { variables } from "../variables.js"
  import Select from "svelte-select"
  import MediaSearch from "../components/media_search.svelte"
  import { currentCountry } from "../stores/country.js"
  import { currentProviders } from "../stores/providers.js"
  import { currentGenres } from "../stores/genres"
  import { inputQuery } from "../stores/input"
  import { chosenTheme } from "../stores/theme.js"
  import { onMount } from "svelte"
  import DaisyuiThemes from "daisyui/colors/themes.js"

  const SEARCH_URL: string = `${variables.apiPath}/search/`
  const GENRE_URL: string = `${variables.apiPath}/genres/`
  const PROVIDER_URL: string = `${variables.apiPath}/providers/`
  const INPUT_TIMER: number = 200
  const MEDIA_START_AMOUNT: number = 21

  let input: string = ""
  let timer
  let media = []
  let selectedGenres = []
  let providerAmounts: number[] = []
  let genres
  let activeProviders = [""]
  let currentMediaAmount: number = 21

  // run search if we haven't received input in the last 200ms
  const debounceInput = () => {
    currentMediaAmount = MEDIA_START_AMOUNT
    clearTimeout(timer)
    timer = setTimeout(() => {
      search()
    }, INPUT_TIMER)
  }

  // TODO: Replace any with a Media type
  const hitProviderAmounts = (searchHits: [any]) => {
    providerAmounts = []
    searchHits.forEach(hit => {
      providerAmounts.push(hit.specific_providers.length)
    })
  }

  const search = async () => {
    // Builds the optional query for genres
    // Example: "?g=Action&g=Comedy&g=Drama"
    let query = ""
    for (let i = 0; i < selectedGenres.length; i++) {
      query += `&g=${selectedGenres[i]}`
    }
    for (let i = 0; i < $currentProviders.length; i++) {
      query += `&p=${$currentProviders[i]}`
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
    $currentGenres = selectedGenres
    media = await res.json()
    hitProviderAmounts(media.hits)
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
    const inputField = document.getElementById("input-field")
    setTimeout(function () {
      inputField.select()
    }, 20)

    await fetchGenres()
    await fetchProviders()

    if ($currentGenres !== []) {
      selectedGenres = $currentGenres
    }
    if ($inputQuery !== "") {
      input = $inputQuery
      debounceInput()
    } else {
      await search()
    }
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
    class="sm:grid sm:grid-cols-2 sm:gap-2 mt-2 svelte-select"
    style="
             --borderRadius: var(--rounded-btn, .5rem);
             --background: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`]['base-100']};
             --border: 1px solid {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary'
    ]};
             --borderFocusColor: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary'
    ]};
             --borderHoverColor: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary'
    ]};
             --itemIsActiveColor: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary'
    ]};
             --multiItemActiveColor: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary'
    ]};
             --multiItemBG: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`]['primary']};
             --multiItemActiveBG: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'primary-focus'
    ]};
             --itemIsActiveBG: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'neutral'
    ]}
             --clearSelectHoverColor: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'base-content'
    ]};
             --listBackground: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`][
      'neutral'
    ]};
             --itemHoverBG: {DaisyuiThemes[`[data-theme=${$chosenTheme}]`]['primary']}
              "
  >
    <Select
      on:select={(e) => {
        if (e.detail) {
          e.detail.forEach(({ value }) => selectedGenres.push(value))
          debounceInput()
        }
      }}
      on:clear={(e) => {
        selectedGenres.splice(selectedGenres.indexOf(e.detail["value"]))
        debounceInput()
      }}
      items={genres}
      isMulti={true}
      placeholder="Select genres..."
    />
    <Select
      on:select={(e) => {
        e.detail.forEach(({ value }) => $currentProviders.push(value))
        debounceInput()
      }}
      on:clear={(e) => {
        $currentProviders.splice($currentProviders.indexOf(e.detail["value"]))
        debounceInput()
      }}
      items={activeProviders}
      isMulti={true}
      placeholder="Select providers..."
    />
  </div>
</div>
<MediaSearch
  {media}
  {providerAmounts}
  currentCountry={$currentCountry}
  currentProviders={$currentProviders}
  mediaStartAmount={MEDIA_START_AMOUNT}
  bind:currentMediaAmount
  {input}
  currentGenres={$currentGenres}
  {search}
/>

<style>
  @media (max-width: 768px) {
    .svelte-select {
      --margin: 5px;
    }
  }
</style>
