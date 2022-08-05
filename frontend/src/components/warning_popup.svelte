<script lang="ts">
  let warningTitle = "Provider data issues"
  let warningMessage =
    "We are currently experiencing issues with our provider data, and it might therefore be inaccurate. We are working to fix the issue as soon as possible!"
  let showComponent = true
</script>

{#if showComponent}
  <div class="flex justify-center">
    <div class="alert bg-base-300 shadow-lg fixed top-10 max-w-xl">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <span class="px-2"
          ><b>{warningTitle}</b>
          <p class="text-sm">{warningMessage}</p></span
        >
      </div>
      <div class="flex-none">
        <button on:click={() => (showComponent = false)} class="btn btn-sm btn-primary"
          >Close</button
        >
      </div>
    </div>
  </div>
{/if}
