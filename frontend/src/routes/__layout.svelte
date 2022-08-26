<script>
  import "../app.css"
  import Navbar from "../components/navbar/navbar.svelte"
  import PhoneNavbar from "../components/navbar/phone_navbar.svelte"
  import Footer from "../components/footer.svelte"
  import BackToTopButton from "../components/back_to_top_button.svelte"
  import CookieDisclaimer from "../components/cookie_disclaimer.svelte"
  import MediaQuery from "svelte-media-query"
  import CountryLocator from "../components/country_locator.svelte"
  import Filters from "../components/drawer/filters.svelte"
</script>

<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <div class="flex flex-col h-screen">
      <!-- Query for mobile -->
      <MediaQuery query="(max-width: 640px)" let:matches>
        {#if matches}
          <PhoneNavbar />
        {:else}
          <Navbar />
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
    <label for="my-drawer" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <Filters />
    </ul>
  </div>
</div>
