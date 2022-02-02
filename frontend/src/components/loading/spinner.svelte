<script lang="ts">
  import { onMount } from "svelte"

  const LONG_LOAD_TIME = 3000
  let tooLongLoad = false

  onMount(async () => {
    setTimeout(() => (tooLongLoad = true), LONG_LOAD_TIME)
  })
</script>

<div class="mt-20">
  <div class="flex justify-center items-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-8 border-primary" />
  </div>
  {#if tooLongLoad}
    <h2 class="flex justify-center pt-6">
      This page is taking longer to load than usual...
    </h2>
    <br />
    <div class="flex justify-center">
      <button
        on:click={() => window.history.back()}
        id="goback"
        class="btn btn-primary"
      >
        Back to safety
      </button>
    </div>
  {/if}
</div>
