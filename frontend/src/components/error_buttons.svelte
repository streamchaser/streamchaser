<script lang="ts">
</script>

{#if window.history.length > 1}
  <button on:click={() => window.history.back()} id="goback" class="btn btn-primary">
    Previous Page
  </button>
  <button on:click={() => (window.location.href = "/")} class="btn btn-primary">
    Home
  </button>
{:else}
  <button on:click={() => (window.location.href = "/")} class="btn btn-primary">
    Home
  </button>
{/if}
