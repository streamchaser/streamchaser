<script lang="ts">
  import { currentCountry } from "$lib/stores/preferences"
  import { isBurgerMenuOpen } from "$lib/stores/stores"
  import type { GetCountriesResult } from "$lib/generated"
  import Select from "svelte-select"
  import { get } from "svelte/store"

  export let countries: GetCountriesResult[]
</script>

<div>
  <div
    class="sm:w-32 md:w-52 lg:w-56 w-52"
    style="
   --borderRadius: var(--rounded-btn, .5rem);
   --background: hsl(var(--b1));
   --border: 1px solid hsl(var(--p));
   --borderFocusColor: hsl(var(--p));
   --borderHoverColor: hsl(var(--pf));
   --itemColor: hsl(var(--er));
   --itemIsActiveBG: hsl(var(--pf));
   --itemIsActiveColor: hsl(var(--pc));
   --clearSelectHoverColor: hsl(var(--pf));
   --itemColor: hsl(var(--nc));
   --listBackground: hsl(var(--n));
   --itemHoverBG: hsl(var(--p));
   --itemHoverColor: hsl(var(--pc));
   --inputColor: hsl(var(--bc));
   --clearSelectFocusColor: hsl(var(--p));
  "
  >
    <Select
      value={countries[countries.findIndex(v => v.value === get(currentCountry))]}
      on:select={e => {
        $currentCountry = e.detail.value
        $isBurgerMenuOpen = !$isBurgerMenuOpen
      }}
      items={countries}
      placeholder="Select country..."
      isClearable={false}
    />
  </div>
</div>
