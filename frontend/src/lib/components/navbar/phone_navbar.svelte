<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import type { SelectCountriesResult } from "$lib/generated"
  import CountrySelector from "$lib/components/country_selector.svelte"
  import ThemeSelector from "$lib/components/theme_selector.svelte"
  import { isBurgerMenuOpen } from "$lib/stores/stores"
  import Auth from "$lib/components/sign_in/auth.svelte"

  export let countries: SelectCountriesResult[]

  const handleDropdownClick = () => {
    $isBurgerMenuOpen = !$isBurgerMenuOpen
  }

  const handleDropdownFocusLost = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget))
      return
    $isBurgerMenuOpen = false
  }
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
  <div class="flex-none pr-2">
    <div class="items-stretch hidden sm:flex">
      <a class="btn btn-ghost btn-sm rounded-btn" href="/about" data-sveltekit-prefetch>
        About
      </a>
      <a class="btn btn-ghost btn-sm rounded-btn" href="/faq" data-sveltekit-prefetch>
        FAQ
      </a>
    </div>
    <ThemeSelector />
    <div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
      <div
        tabindex="-1"
        class="btn btn-ghost btn-sm rounded-btn text-xl"
        on:click={handleDropdownClick}
        on:keypress={handleDropdownClick}
      >
        <div class="swap swap-rotate">
          <svg
            class="{$isBurgerMenuOpen ? 'swap-off' : 'swap-on'} fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            ><polygon
              points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
            /></svg
          >
          <svg
            class="{$isBurgerMenuOpen ? 'swap-on' : 'swap-off'} fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            ><path
              d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
            /></svg
          >
        </div>
      </div>
      <ul
        tabindex="-1"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56"
        style:visibility={$isBurgerMenuOpen ? "visible" : "hidden"}
      >
        <CountrySelector {countries} />
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </div>
  </div>
  <Auth />
</div>
