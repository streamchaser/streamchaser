<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import { themeChange } from "theme-change"
  import { onMount } from "svelte"
  import { currentCountry } from "../../stores/country.js"
  import { chosenTheme } from "../../stores/theme.js"
  import { COUNTRIES, THEMES } from "../../variables.js"

  onMount(() => {
    themeChange(false)
  })
</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content max-h-16">
  <div class="flex-none sm:px-2 sm:mx-2">
    <a href="/">
      <img src="../../navbar_logo_with_image.png" class="w-48" />
    </a>
  </div>
  <div class="flex-1 px-2 mx-2" />
  <div class="flex-none">
    <div class="items-stretch hidden sm:flex">
      <a class="btn btn-ghost btn-sm rounded-btn" href="/about"> About </a>
      <a class="btn btn-ghost btn-sm rounded-btn" href="/faq"> FAQ </a>
    </div>
    <div class="dropdown dropdown-end">
      <div tabindex="0" class="btn btn-ghost btn-sm rounded-btn text-xl">🎨</div>
      <ul
        tabindex="0"
        class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
      >
        {#each THEMES as theme}
          <li
            data-set-theme={theme.value}
            data-act-class="ACTIVECLASS"
            on:click={() => ($chosenTheme = theme.value)}
          >
            {#if $chosenTheme == theme.value}
              <a class="bg-primary hover:bg-primary" href="">
                <p class="text-primary-content">{theme.icon} {theme.value}</p>
              </a>
            {:else}
              <a href="">{theme.icon} {theme.value}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-sm rounded-btn text-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          /></svg
        >
      </label>
      <ul
        tabindex="0"
        class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <select
            bind:value={$currentCountry}
            class="select select-primary select-bordered max-sm"
          >
            <option disabled={true}>Choose country</option>
            {#each COUNTRIES as country}
              <option value={country.value}>{country.icon} {country.name}</option>
            {/each}
          </select>
        </li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </div>
  </div>
</div>
