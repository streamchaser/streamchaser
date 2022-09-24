<script>
  import "../app.css"
  import Navbar from "$lib/components/navbar/navbar.svelte"
  import PhoneNavbar from "$lib/components/navbar/phone_navbar.svelte"
  import Footer from "$lib/components/footer.svelte"
  import BackToTopButton from "$lib/components/back_to_top_button.svelte"
  import CookieDisclaimer from "$lib/components/cookie_disclaimer.svelte"
  import MediaQuery from "svelte-media-query"
  import CountryLocator from "$lib/components/country_locator.svelte"
</script>

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
