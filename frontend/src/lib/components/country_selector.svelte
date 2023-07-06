<script lang="ts">
  import { currentCountry } from "$lib/stores/preferences"
  import { isBurgerMenuOpen } from "$lib/stores/stores"
  import type { SelectCountriesResult } from "$lib/generated"
  import SvelteSelectCSS from "$lib/components/svelte_select_css.svelte"
  import Select from "svelte-select"
  import { get } from "svelte/store"

  export let countries: SelectCountriesResult[]
</script>

<div>
  <SvelteSelectCSS tailwind="sm:w-32 md:w-52 lg:w-56 w-52">
    <Select
      value={countries[countries.findIndex(v => v.value === get(currentCountry))]}
      on:select={e => {
        $currentCountry = e.detail.value
        $isBurgerMenuOpen = !$isBurgerMenuOpen
      }}
      items={countries}
      placeholder="Select country..."
      clearable={false}
    />
  </SvelteSelectCSS>
</div>
