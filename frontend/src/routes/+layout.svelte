<script lang="ts">
  import "../app.css"
  import Navbar from "$lib/components/navbar/navbar.svelte"
  import PhoneNavbar from "$lib/components/navbar/phone_navbar.svelte"
  import Footer from "$lib/components/footer.svelte"
  import BackToTopButton from "$lib/components/back_to_top_button.svelte"
  import CookieDisclaimer from "$lib/components/cookie_disclaimer.svelte"
  import MediaQuery from "svelte-media-query"
  import CountryLocator from "$lib/components/country_locator.svelte"
  import NewFilters from "$lib/components/new_filters.svelte"
  import type { PageData } from "./$types"
  import { allowedCookies } from "$lib/stores/cookies.js"
  import {
    currentCountry,
    currentProviders,
    sorting,
    chosenTheme,
  } from "$lib/stores/preferences"
  import { browser } from "$app/environment"

  $: if (browser && $allowedCookies && $allowedCookies.allowPreference) {
    currentCountry.subscribe(value => {
      localStorage.currentCountry = value
    })
    sorting.subscribe(value => {
      localStorage.setItem("sorting", JSON.stringify(value))
    })
    chosenTheme.subscribe(value => {
      localStorage.chosenTheme = value
    })
    currentProviders.subscribe(value => {
      localStorage.setItem("currentProviders", JSON.stringify(value))
    })
  }

  export let data: PageData
</script>

<div class="drawer drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Page content here -->
    <div class="flex flex-col h-screen">
      <!-- Query for mobile -->
      <MediaQuery query="(max-width: 640px)" let:matches>
        {#if matches}
          <PhoneNavbar countries={data.countries} />
        {:else}
          <Navbar countries={data.countries} />
        {/if}
      </MediaQuery>

      <div class="container mb-auto mx-auto">
        <CountryLocator />
        <slot />
      </div>
      <BackToTopButton />
      <Footer />
      <CookieDisclaimer />
    </div>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay" />
    <ul class="menu p-4 w-80 bg-base-300 text-base-content">
      <!-- Sidebar content here -->
      <NewFilters />
    </ul>
  </div>
</div>
