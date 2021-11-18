<script lang="ts">
    import { routeToPage } from '../../utils'

    export let recommendations: []
    export let imgUrl: string
</script>

<!-- Recommendations -->
{#if recommendations.length != 0}
    <h1 class="text-center text-3xl pt-5">Recommendations</h1>
    <div class="pt-5">
        <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
            {#each recommendations as recommendation}
                {#if recommendation.poster_path}
                    <div
                        on:click={() => routeToPage(recommendation.id, "movie")}
                        class="carousel-item h-96 w-64 p-1">
                        <img
                            src="{imgUrl}{recommendation.poster_path}"
                            class="rounded-lg cursor-pointer"
                            alt={recommendation.title}
                        />
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
