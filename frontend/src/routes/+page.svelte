<script lang="ts">
  import type { Snapshot } from "./$types"
  import { calculateAmountOfShownItems, hitProviderAmounts } from "$lib/utils"
  import { PYTHON_API } from "$lib/variables.js"
  import Select from "svelte-select"
  import MediaSearch from "$lib/components/media_search.svelte"
  import Filters from "$lib/components/filters.svelte"
  import SvelteSelectCSS from "$lib/components/svelte_select_css.svelte"
  import Head from "$lib/components/head.svelte"
  import {
    currentCountry,
    currentProviders,
    currentGenres,
    filters,
    sorting,
  } from "$lib/stores/preferences"
  import type { Meilisearch } from "$lib/generated"
  import type { PageData } from "./$types"
  import { afterNavigate, invalidateAll } from "$app/navigation"
  import { browser } from "$app/environment"

  export let data: PageData

  const SEARCH_URL = `${PYTHON_API}/search/`

  let input = ""
  let meilisearch: Meilisearch
  let providerAmounts: number[] = []
  let viewPortWidth: number
  let currentMediaAmount: number
  let mediaStartAmount: number

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
    if (!currentMediaAmount) {
      setViewportToDefault()
    }

    if (isSnapshotLoad) {
      isSnapshotLoad = false
      return
    }

    console.log("search called")

    // Builds the optional query for genres
    // Example: "?g=Action&g=Comedy&g=Drama"
    let query = ""

    // Sanitizes input by removing any character that is not a letter,
    // number, whitespace or an ampersand and replaces them with a space
    let userInput = input.replace(/[^\w\d\s\&]/g, " ")

    // Searches for all(*) if empty input
    // Empty input will only return media with providers
    if (input == "") {
      userInput = "*"
      if (!$filters.checked.person) {
        query += "&only_providers=true"
      }
    }

    for (let i = 0; i < $currentGenres.length; i++) {
      query += `&g=${$currentGenres[i].value}`
    }
    for (let i = 0; i < $currentProviders.length; i++) {
      query += `&p=${$currentProviders[i].value}`
    }

    if ($filters.checked.movie) {
      query += "&t=movie"
    }
    if ($filters.checked.tv) {
      query += "&t=tv"
    }
    if ($filters.checked.person) {
      query += "&t=person"
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

    const res = await fetch(
      SEARCH_URL +
        userInput +
        "?c=" +
        $currentCountry +
        query +
        `&limit=${currentMediaAmount}`
    )

    meilisearch = await res.json()
    providerAmounts = hitProviderAmounts(meilisearch.hits, $currentCountry)
  }

  $: if (browser && data.providers) {
    let selectedProviders = $currentProviders
    for (let i = 0; i < selectedProviders.length; i++) {
      if (
        !data.providers[0].providers
          .map(v => v.provider_name)
          .includes(selectedProviders[i].value)
      ) {
        selectedProviders.splice(i, 1)
        i--
      }
    }
    $currentProviders = selectedProviders
  }

  let isSnapshotLoad = false
  export const snapshot: Snapshot = {
    capture() {
      console.log("capturing")
      console.log(scrollY)
      console.log(meilisearch.hits.length)
      return {
        scrollY: scrollY,
        mediaCount: currentMediaAmount,
        providerCount: providerAmounts,
        medias: meilisearch,
        prevInput: input,
      }
    },
    restore({ scrollY, mediaCount, providerCount, medias, prevInput }) {
      console.log("restoring")
      currentMediaAmount = mediaCount
      meilisearch = medias
      input = prevInput
      providerAmounts = providerCount
      isSnapshotLoad = true

      console.log(scrollY)
      console.log(medias)
      console.log(medias.hits.length)
      console.log(prevInput)

      setTimeout(() => {
        console.log("scrollTo called: " + scrollY)
        scrollTo(0, scrollY)
      }, 0)
    },
  }

  // Invalidates data (refetched) when the country changes
  // The browser check is because of the messy viewport logic
  $: if ($currentCountry) {
    if (browser) {
      setViewportToDefault() // TODO: There must be a nicer way
      invalidateAll()
      afterNavigate(() => {
        search()
      })
    }
  }
</script>

<Head title="streamchaser" />

<div class="bg-neutral shadow-md card pb-2 pt-6 px-2 sm:px-6">
  <div class="flex justify-between">
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
    <Filters {search} />
  </div>
  <SvelteSelectCSS tailwind="sm:grid sm:grid-cols-2 sm:gap-2 mt-2 mb-3">
    <div class="mb-2 sm:mb-0">
      <Select
        on:input={e => {
          $currentGenres = e.detail ? e.detail : []
          setViewportToDefault()
          search()
        }}
        on:clear={() => {
          $currentGenres = []
          setViewportToDefault()
          search()
        }}
        items={data.genres}
        multiple={true}
        value={$currentGenres}
        placeholder="Select genres..."
      />
    </div>
    <div>
      <Select
        on:input={e => {
          $currentProviders = e.detail ? e.detail : []
          setViewportToDefault()
          search()
        }}
        on:clear={() => {
          $currentProviders = []
          setViewportToDefault()
          search()
        }}
        items={data.providers[0].providers.map(v => v.provider_name)}
        value={$currentProviders}
        multiple={true}
        placeholder="Select providers..."
      />
    </div>
  </SvelteSelectCSS>
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
