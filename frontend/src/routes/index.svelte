<script lang="ts">
  import { getKeyByValue, getFixedGenreValues } from "../utils"
  import { variables } from "../variables.js"
  import Navbar from "../components/navbar.svelte"
  import Footer from "../components/footer.svelte"
  import CookieDisclaimer from "../components/cookie_disclaimer.svelte"
  import MultiSelect from "svelte-multiselect"
  import MediaSearch from "../components/media_search.svelte"
  import { currentCountry } from "../stores/country.js"
  import { currentProviders } from "../stores/providers.js"
  import { currentGenres } from "../stores/genres"
  import { inputQuery } from "../stores/input"
  import { currentTheme } from "../stores/theme.js"
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
  let formattedGenres: {} = { "": "" }
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
    searchHits.forEach((hit) => {
      providerAmounts.push(hit.specific_providers.length)
    })
  }

  const search = async () => {
    // Builds the optional query for genres
    // Example: "?g=Action&g=Comedy&g=Drama"
    let query = ""
    for (let i = 0; i < selectedGenres.length; i++) {
      query += `&g=${getKeyByValue(formattedGenres, selectedGenres[i])}`
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
    formattedGenres = await res.json()
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

<div class="flex flex-col h-screen justify-between">
  <Navbar />
  <div class="container mb-auto mx-auto">
    <div class="bg-neutral sm:rounded-lg pb-2 pt-6 px-6">
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
      <div class="sm:grid sm:grid-cols-2 sm:gap-2">
        <MultiSelect
          outerDivClass="bg-base-100"
          --sms-options-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral-focus"
          ]}
          --sms-text-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral-content"
          ]}
          --sms-border="1pt solid {DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            'primary'
          ]}"
          --sms-focus-border="2pt solid {DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            'primary'
          ]}"
          --sms-active-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`]["primary"]}
          --sms-remove-x-hover-focus-color={DaisyuiThemes[
            `[data-theme=${$currentTheme}]`
          ]["base-content"]}
          --sms-li-selected-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral"
          ]}
          --sms-li-active-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`]["primary"]}
          --sms-selected-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "primary"
          ]}
          bind:selected={selectedGenres}
          on:change={debounceInput}
          options={getFixedGenreValues(formattedGenres)}
          placeholder="Select genres..."
        />
        <MultiSelect
          outerDivClass="bg-base-100"
          --sms-options-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral-focus"
          ]}
          --sms-text-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral-content"
          ]}
          --sms-border="1pt solid {DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            'primary'
          ]}"
          --sms-focus-border="2pt solid {DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            'primary'
          ]}"
          --sms-active-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`]["primary"]}
          --sms-remove-x-hover-focus-color={DaisyuiThemes[
            `[data-theme=${$currentTheme}]`
          ]["base-content"]}
          --sms-li-selected-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "neutral"
          ]}
          --sms-li-active-bg={DaisyuiThemes[`[data-theme=${$currentTheme}]`]["primary"]}
          --sms-selected-color={DaisyuiThemes[`[data-theme=${$currentTheme}]`][
            "primary"
          ]}
          bind:selected={$currentProviders}
          on:change={debounceInput}
          options={activeProviders}
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
  </div>
  <Footer />
</div>
<CookieDisclaimer />
