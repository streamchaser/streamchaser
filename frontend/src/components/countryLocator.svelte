<script lang="ts">
  import { onMount } from "svelte"
  import { patron } from "../stores/patron"
  import { currentCountry } from "../stores/country"
  import { PYTHON_API } from "../variables"

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

<button on:click={lookupCountry}>Hejsa</button>

<h1>Patron: {$patron}</h1>
<h1>Current country: {$currentCountry}</h1>
