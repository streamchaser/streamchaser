<script lang="ts">
  import Error from "../components/error.svelte"
  import { onMount } from "svelte"

  // This is a temp fix for the firefox dyanmic import bug
  // TODO: Find a proper way to fix the dynamic import issue a remove this
  let loadError = false

  onMount(async () => {
    setTimeout(() => (loadError = true), 100)
  })
</script>

<svelte:head>
  {#if loadError}
    <title>404 Page not found</title>
  {/if}
</svelte:head>

{#if loadError}
  <div class="flex flex-col h-screen justify-between">
    <Error error={"404 Page not found"} />
  </div>
{/if}
