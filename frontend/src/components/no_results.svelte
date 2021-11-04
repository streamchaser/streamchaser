<script lang="ts">
    export let currentProviders: [];
    export let currentGenres: [];
    export let input: string;
</script>

<div class="flex flex-col">
    <div class="m-auto text-center max-w-xl">
        <p>No results for:</p>
        <p><b><i>{input ? input : "<No input>"}</i></b></p>
        {#if currentGenres.length > 0}
            <p class="pt-2">Genres:</p>
            {#each currentGenres as genre}
                <div class="badge mx-1">{genre}</div>
            {/each}
        {/if}
        {#if currentProviders.length > 0}
            <p class="pt-2">Providers:</p>
            {#each currentProviders as provider}
                <div class="badge mx-1">{provider}</div>
            {/each}
        {/if}
    </div>
</div>
