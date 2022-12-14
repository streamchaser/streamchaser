<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import type { main_Country } from "$lib/generated/go"

  import CountrySelector from "../country_selector.svelte"
  import ThemeSelector from "../theme_selector.svelte"

  export let countries: main_Country[]

  let isDropdownOpen = false

  const handleDropdownClick = () => {
    isDropdownOpen = !isDropdownOpen
  }

  const handleDropdownFocusLost = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget))
      return
    isDropdownOpen = false
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
    <div class="dropdown dropdown-end" on:focusout={handleDropdownFocusLost}>
      <label
        tabindex="0"
        class="btn btn-ghost btn-sm rounded-btn text-xl"
        on:click={handleDropdownClick}
      >
        {#if isDropdownOpen}
          <svg
            class="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            ><polygon
              points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
            /></svg
          >
        {:else}
          <svg
            class="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
            ><path
              d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"
            /></svg
          >
        {/if}
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-60"
        style:visibility={isDropdownOpen ? "visible" : "hidden"}
      >
        <li>
          <CountrySelector {countries} />
        </li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/about">About</a></li>
        <li>
          <a href="https://github.com/streamchaser/streamchaser">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              ><path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              /></svg
            >
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
