<script lang="ts">
    import { routeToPage } from '../utils'
    import NoResults from '../components/no_results.svelte';

    const SHOWN_PROVIDERS: number = 5;
    const SHOW_BUTTON_AMOUNT: number = 21;
    const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
	const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';

    export let media
    export let providerAmounts: number[]
    export let currentCountry: string
    export let currentProviders
    export let mediaStartAmount: number
    export let currentMediaAmount: number
    export let input: string
    export let currentGenres: []
    export let search

    const changeMediaAmount = (buttonElement: string) => {
        currentMediaAmount = buttonElement === 'loadmore' ? currentMediaAmount + SHOW_BUTTON_AMOUNT : currentMediaAmount - SHOW_BUTTON_AMOUNT;
        search()
    }

</script>

<!-- TODO: Why is both checks needed? -->
{#if media.hits}
    {#if media.hits.length}
        <div class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-2 px-4 pt-2 pb-4 bg-base-100">
            {#each media.hits as media, mediaIndex}
                <div
                    on:click={routeToPage(media.id)}
                    class="card compact bordered w-auto transition duration-500 ease-in-out cursor-pointer transform hover:scale-110 m-1">
                    <figure>
                        <img
                            src="{LOW_RES_IMG_URL}{media.poster_path}"
                            alt="media poster"
                        />
                    </figure>
                    {#if providerAmounts[mediaIndex] === 0}
                        <div class="card-body">
                            <p class="text-center">
                                <strong>No providers in {currentCountry}</strong>
                            </p>
                        </div>
                    {:else if providerAmounts[mediaIndex] <= SHOWN_PROVIDERS}
                        <div class="-space-x-4 avatar-group">
                            {#each media.specific_providers as provider}
                                <div class="avatar">
                                    <div class="w-12 h-12">
                                        <img
                                            src="{IMG_URL}{provider.logo_path}"
                                            alt="provider logo"
                                        />
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="-space-x-4 avatar-group">
                            {#each media.specific_providers.slice(0, SHOWN_PROVIDERS - 1) as provider}
                                <div class="avatar">
                                    <div class="w-12 h-12">
                                        <img
                                            src="{IMG_URL}{provider.logo_path}"
                                            alt="provider logo"
                                        />
                                    </div>
                                </div>
                            {/each}
                            <div class="avatar placeholder">
                                <div
                                    class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                                    <span>
                                        +{providerAmounts[mediaIndex] - SHOWN_PROVIDERS + 1}
                                    </span>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        <div class="flex space-x-1 justify-center p-1">
            {#if currentMediaAmount < media.nbHits}
                <button
                    on:click={() => {
                        changeMediaAmount("loadmore");
                    }}
                    id="loadmore"
                    type="button"
                    class="btn">
                    Show more
                </button>
            {/if}
            {#if currentMediaAmount > mediaStartAmount}
                <button
                    on:click={() => {
                        changeMediaAmount("loadless");
                    }}
                    id="loadless"
                    type="button"
                    class="btn">
                    Show less
                </button>
            {/if}
        </div>
    {:else}
        <NoResults
            currentProviders={currentProviders}
            currentGenres={currentGenres}
            input={input}
        />
    {/if}
{/if}
