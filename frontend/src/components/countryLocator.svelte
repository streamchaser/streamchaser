<script lang="ts">
  import { onMount } from "svelte"
  import { patron } from "../stores/patron"
  import { currentCountry } from "../stores/country"
  import { PYTHON_API } from "../variables"

  let error: boolean = true // TODO: Should default to false when done

  const lookupCountry = async () => {
    await fetch(`${PYTHON_API}/country`)
      .then(async (response: Response) => {
        const data = await response.json()

        if (!response.ok) {
          const error = (data && data.message) || response.status
          return Promise.reject(error)
        }

        // Marks client as a regular user
        $patron = true
        $currentCountry = data
      })
      .catch(error => {
        console.error(
          "Error looking up country:",
          error,
          "defaulting to:",
          $currentCountry
        )
      })
  }

  onMount(async () => {
    // Will only look for the country of new users
    if (!$patron) {
      await lookupCountry()
    }
  })
</script>

{#if error}
  <div class="alert shadow-lg">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info flex-shrink-0 w-6 h-6"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>
        We were unable to locate your country and chose {$currentCountry}. You can
        change the country manually in the top right menu.</span
      >
    </div>
    <div class="flex-none">
      <button on:click={() => (error = false)} class="btn btn-sm btn-primary"
        >Close</button
      >
    </div>
  </div>
  <br />
{/if}

<!-- TODO: Remove when done debugging -->

<button class="btn" on:click={lookupCountry}>Lookup country</button>

<h1>Patron: {$patron}</h1>
<h1>Current country: {$currentCountry}</h1>
