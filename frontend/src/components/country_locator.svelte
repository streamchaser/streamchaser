<script lang="ts">
  import { onMount } from "svelte"
  import { currentCountry, confirmedCountry } from "../stores/country"
  import { PYTHON_API } from "../variables"

  let hasError = false
  let errorMsg: string

  const lookupCountry = async () => {
    await fetch(`${PYTHON_API}/country`)
      .then(async (response: Response) => {
        const data = await response.json()

        if (!response.ok) {
          hasError = true
          const error = (data && data.message) || response.status
          return Promise.reject(error)
        }

        // Marks client as a regular user
        $confirmedCountry = true
        $currentCountry = data
      })
      .catch(error => {
        errorMsg = error
        console.error(errorMsg)
      })
  }

  onMount(async () => {
    // Will only look for the country of new users
    if (!$confirmedCountry) {
      await lookupCountry()
    }
  })
</script>

{#if hasError}
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
        {#if errorMsg}
          {errorMsg}
        {/if}
        We have chosen {$currentCountry} for you. You can change it at any time in the top
        right menu."
      </span>
    </div>
    <div class="flex-none">
      <button on:click={() => (hasError = false)} class="btn btn-sm btn-primary"
        >Close</button
      >
    </div>
  </div>
  <br />
{/if}
