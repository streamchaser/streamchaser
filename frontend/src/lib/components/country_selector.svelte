<script lang="ts">
  import { COUNTRIES } from "../variables.js"
  import { currentCountry } from "../stores/country.js"
</script>

<select bind:value={$currentCountry} class="select select-bordered max-sm">
  <option disabled={true}>Choose country</option>
  {#each COUNTRIES as country}
    <option value={country.value}>{country.icon} {country.name}</option>
  {/each}
</select>
