<script lang="ts">
    import { routeToPage } from '../../utils'

    export let imgUrl: string
    export let media: []
    export let mediaType: string
    export let title: string
    export let mediaAmount: number
    export let showButtonAmount: number
    export let itemStartAmount: number;
</script>

{#if media.length != 0}
    <h1 class="text-center text-3xl pt-5">{title}</h1>
    <div class="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
        {#each media.slice(0, mediaAmount) as media}
            <div
                on:click={() => routeToPage(media.id, mediaType)}
                class="card compact cursor-pointer bordered">
                <figure>
                    {#if mediaType === 'movie'}
                    <img
                        src="{imgUrl}{media.poster_path}"
                        alt={media.title}
                    />
                    {:else}
                    <img
                        src="{imgUrl}{media.poster_path}"
                        alt={media.name}
                    />
                    {/if}
                </figure>
            </div>
        {/each}
    </div>
    <div class="flex space-x-1 justify-center p-1">
        {#if mediaAmount < media.length}
            <button
                on:click={() => (mediaAmount = mediaAmount + showButtonAmount)}
                id="loadmore"
                type="button"
                class="btn">
                Show more
            </button>
        {/if}
        {#if mediaAmount > itemStartAmount}
            <button
                on:click={() => (mediaAmount = mediaAmount - showButtonAmount)}
                id="loadmore"
                type="button"
                class="btn">
                Show less
            </button>
        {/if}
    </div>
{/if}
