<!-- https://daisyui.com/components/navbar -->
<script lang="ts">
  import { themeChange } from "theme-change"
  import { onMount } from "svelte"
  import { currentCountry } from "../stores/country.js"
  import { chosenTheme } from "../stores/theme.js"

  let selectedCountry = $currentCountry

  const countries = [
    { name: "Denmark", value: "DK" },
    { name: "Germany", value: "DE" },
    { name: "Sweden", value: "SE" },
    { name: "UK", value: "GB" },
    { name: "USA", value: "US" },
  ]

  const themes = ["🌚 dark", "🌲 forest", "🎃 halloween", "💎 luxury", "🌆 synthwave"]

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
          <li>
            <a
              data-set-theme={theme.split(" ")[1]}
              data-act-class="ACTIVECLASS"
              on:click={() => ($chosenTheme = theme.split(" ")[1])}
              >{theme}
            </a>
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
        <option value={country.value}>{country.name}</option>
      {/each}
    </select>
  </div>
</div>
