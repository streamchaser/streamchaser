<script lang="ts">
    import { mediaIdToUrlConverter } from '../../utils'

    const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
    const SHOW_BUTTON_AMOUNT: number = 12;
    const CAST_ITEM_START_AMOUNT: number = 6;

    export let media: []
    export let mediaType: string
    export let title: string

    let mediaAmount: number = 6
</script>

{#if media.length}
    <h1 class="text-center text-3xl pt-5">{title}</h1>
    <div class="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
        {#each media.slice(0, mediaAmount) as media}
            <a href="{mediaIdToUrlConverter(media.id, mediaType)}"
                class="card compact cursor-pointer bordered">
                <figure>
                    {#if mediaType === 'movie'}
                    <img
                        src="{LOW_RES_IMG_URL}{media.poster_path}"
                        alt={media.title}
                    />
                    {:else}
                    <img
                        src="{LOW_RES_IMG_URL}{media.poster_path}"
                        alt={media.name}
                    />
                    {/if}
                </figure>
            </a>
        {/each}
    </div>
    <div class="flex space-x-1 justify-center p-1">
        {#if mediaAmount < media.length}
            <button
                on:click={() => (mediaAmount = mediaAmount + SHOW_BUTTON_AMOUNT)}
                id="loadmore"
                type="button"
                class="btn">
                Show more
            </button>
        {/if}
        {#if mediaAmount > CAST_ITEM_START_AMOUNT}
            <button
                on:click={() => (mediaAmount = mediaAmount - SHOW_BUTTON_AMOUNT)}
                id="loadmore"
                type="button"
                class="btn">
                Show less
            </button>
        {/if}
    </div>
{/if}
