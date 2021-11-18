<script lang="ts">
    import { routeToPage } from '../utils'
    import NoResults from '../components/no_results.svelte';

    export let media
    export let lowResUrl: string
    export let imgUrl: string
    export let providerAmounts: number[]
    export let currentCountry: string
    export let shownProviders: number
    export let currentProviders
    export let currentMediaAmount: number
    export let mediaStartAmount: number
    export let showButtonAmount: number
    export let input: string
    export let currentGenres: []
    export let search

    const changeMediaAmount = (buttonElement: string) => {
        currentMediaAmount = buttonElement === 'loadmore' ? currentMediaAmount + showButtonAmount : currentMediaAmount - showButtonAmount;
        search()
    }

</script>

{#if media.hits}
    {#if media.hits.length > 0}
        <div class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-2 px-4 pt-2 pb-4 bg-base-100">
            {#each media.hits as media, mediaIndex}
                <div
                    on:click={routeToPage(media.id)}
                    class="card compact bordered w-auto transition duration-500 ease-in-out cursor-pointer transform hover:scale-110 m-1">
                    <figure>
                        <img
                            src="{lowResUrl}{media.poster_path}"
                            alt="media poster"
                        />
                    </figure>
                    {#if providerAmounts[mediaIndex] === 0}
                        <div class="card-body">
                            <p class="text-center">
                                <strong>No providers in {currentCountry}</strong>
                            </p>
                        </div>
                    {:else if providerAmounts[mediaIndex] <= shownProviders}
                        <div class="-space-x-4 avatar-group">
                            {#each media.specific_providers as provider}
                                <div class="avatar">
                                    <div class="w-12 h-12">
                                        <img
                                            src="{imgUrl}{provider.logo_path}"
                                            alt="provider logo"
                                        />
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="-space-x-4 avatar-group">
                            {#each media.specific_providers.slice(0, shownProviders - 1) as provider}
                                <div class="avatar">
                                    <div class="w-12 h-12">
                                        <img
                                            src="{imgUrl}{provider.logo_path}"
                                            alt="provider logo"
                                        />
                                    </div>
                                </div>
                            {/each}
                            <div class="avatar placeholder">
                                <div
                                    class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                                    <span>
                                        +{providerAmounts[mediaIndex] - shownProviders + 1}
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
            {input}
        />
    {/if}
{/if}
