<script lang="ts">
  export let currentDescriptionLength: number
  export let mediaDescription: string
  export let initialDescriptionLength: number
</script>

{#if currentDescriptionLength <= initialDescriptionLength && mediaDescription.length > initialDescriptionLength}
  <p>
    {mediaDescription.slice(0, currentDescriptionLength)}
    <button
      class="cursor-pointer text-blue-500"
      on:click={() => (currentDescriptionLength = mediaDescription.length)}
    >
      <i>...read more</i>
    </button>
  </p>
{:else}
  <p>{mediaDescription}</p>
{/if}
