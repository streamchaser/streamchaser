<script lang="ts">
  let warningTitle = "Provider data issues"
  let warningMessage =
    "We are currently experiencing issues with our provider data, and it might therefore be inaccurate. We are working to fix the issue as soon as possible!"
  let showComponent = true
</script>

{#if showComponent}
  <div class="flex justify-center">
    <div class="card w-md bg-base-300 shadow-xl fixed top-10">
      <div class="card-body">
        <h2 class="card-title">{warningTitle}</h2>
        <p>{warningMessage}</p>
        <div class="card-actions justify-center">
          <button on:click={() => (showComponent = false)} class="btn btn-primary"
            >Close</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
