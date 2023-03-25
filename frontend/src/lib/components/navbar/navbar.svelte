<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import type { SelectCountriesResult } from "$lib/generated"
  import CountrySelector from "$lib/components/country_selector.svelte"
  import Auth from "$lib/components/sign_in/auth.svelte"
  import ThemeSelector from "$lib/components/theme_selector.svelte"
  import { env } from "$env/dynamic/public"

  export let countries: SelectCountriesResult[]
</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content max-h-16">
  <div class="flex-none sm:px-2 sm:mx-2">
    <a href="/">
      <img
        src="../../navbar_logo_with_image.png"
        alt="streamchaser logo"
        class="w-48"
      />
    </a>
  </div>
  <div class="flex-1 px-2 mx-2" />
  <div class="flex-none">
    <div class="items-stretch hidden sm:flex">
      <a class="btn btn-ghost btn-sm rounded-btn" href="/about" data-sveltekit-prefetch>
        About
      </a>
      <a class="btn btn-ghost btn-sm rounded-btn" href="/faq" data-sveltekit-prefetch>
        FAQ
      </a>
    </div>
    <ThemeSelector />
  </div>
  <div class="sm:px-2">
    <CountrySelector {countries} />
  </div>
  {#if env.PUBLIC_GOOGLE_ENABLED === "true"}
    <Auth />
  {/if}
</div>
