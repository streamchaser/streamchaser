<script lang="ts">
    export let currentDescriptionLength;
    export let mediaDescription;
    export let initialDescriptionLength;
</script>

{#if currentDescriptionLength <= initialDescriptionLength && mediaDescription.length > initialDescriptionLength}
    <p>{mediaDescription.slice(0, currentDescriptionLength)}
        <a href="" class="cursor-pointer text-blue-400"
        on:click={() => currentDescriptionLength = mediaDescription.length}>
        <i>...read more</i>
        </a>
    </p>
{:else}
    <p>{mediaDescription}</p>
{/if}
