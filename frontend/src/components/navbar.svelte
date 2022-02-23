<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import { themeChange } from "theme-change"
  import { onMount } from "svelte"
  import { currentCountry } from "../stores/country.js"
  import { chosenTheme } from "../stores/theme.js"

  let selectedCountry = $currentCountry

  const countries = [
    { name: "Argentina", value: "AR", icon: "🇦🇷" },
    { name: "Australia", value: "AU", icon: "🇦🇺" },
    { name: "Austria", value: "AT", icon: "🇦🇹" },
    { name: "Belgium", value: "BE", icon: "🇧🇪" },
    { name: "Bulgaria", value: "BG", icon: "🇧🇬" },
    { name: "Brazil", value: "BR", icon: "🇧🇷" },
    { name: "Canada", value: "CA", icon: "🇨🇦" },
    { name: "Croatia", value: "HR", icon: "🇭🇷" },
    { name: "colombia", value: "CO", icon: "🇨🇴" },
    { name: "Czechia", value: "CZ", icon: "🇨🇿" },
    { name: "Denmark", value: "DK", icon: "🇩🇰" },
    { name: "Finland", value: "FI", icon: "🇫🇮" },
    { name: "France", value: "FR", icon: "🇫🇷" },
    { name: "Germany", value: "DE", icon: "🇩🇪" },
    { name: "Hungary", value: "HU", icon: "🇭🇺" },
    { name: "India", value: "IN", icon: "🇮🇳" },
    { name: "Ireland", value: "IE", icon: "🇮🇪" },
    { name: "Italy", value: "IT", icon: "🇮🇹" },
    { name: "Latvia", value: "LV", icon: "🇱🇻" },
    { name: "Mexico", value: "MX", icon: "🇲🇽" },
    { name: "Netherlands", value: "NL", icon: "🇳🇱" },
    { name: "New Zealand", value: "NZ", icon: "🇳🇿" },
    { name: "Norway", value: "NO", icon: "🇳🇴" },
    { name: "Poland", value: "PL", icon: "🇵🇱" },
    { name: "Romania", value: "RO", icon: "🇷🇴" },
    { name: "Russia", value: "RU", icon: "🇷🇺" },
    { name: "Singapore", value: "SG", icon: "🇸🇬" },
    { name: "Spain", value: "ES", icon: "🇪🇸" },
    { name: "Sweden", value: "SE", icon: "🇸🇪" },
    { name: "Switzerland", value: "CH", icon: "🇨🇭" },
    { name: "UK", value: "GB", icon: "🇬🇧" },
    { name: "USA", value: "US", icon: "🇺🇸" },
  ]

  const themes = [
    { icon: "💎", value: "luxury" },
    { icon: "🌚", value: "dark" },
    { icon: "🌲", value: "forest" },
    { icon: "🎃", value: "halloween" },
    { icon: "🌆", value: "synthwave" },
  ]

  onMount(() => {
    themeChange(false)
  })
</script>

<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content">
  <div class="flex-none sm:px-2 sm:mx-2">
    <a href="/">
      <span class="text-lg font-bold"> streamchaser </span>
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
        {#each themes as theme}
          <li
            data-set-theme={theme.value}
            data-act-class="ACTIVECLASS"
            on:click={() => ($chosenTheme = theme.value)}
          >
            {#if $chosenTheme == theme.value}
              <a class="bg-primary hover:bg-primary">
                {theme.icon}
                {theme.value}
              </a>
            {:else}
              <a>{theme.icon} {theme.value}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="sm:pl-4">
    <select
      bind:value={selectedCountry}
      on:change={currentCountry.set(selectedCountry)}
      class="select select-primary select-bordered max-sm"
    >
      <option disabled={true}>Choose country</option>
      {#each countries as country}
        <option value={country.value}>{country.icon} {country.name}</option>
      {/each}
    </select>
  </div>
</div>
