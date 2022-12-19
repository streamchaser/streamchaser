<script lang="ts">
  import "../app.css"
  import Navbar from "$lib/components/navbar/navbar.svelte"
  import PhoneNavbar from "$lib/components/navbar/phone_navbar.svelte"
  import Footer from "$lib/components/footer.svelte"
  import BackToTopButton from "$lib/components/back_to_top_button.svelte"
  import CookieDisclaimer from "$lib/components/cookie_disclaimer.svelte"
  import MediaQuery from "svelte-media-query"
  import CountryLocator from "$lib/components/country_locator.svelte"
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
