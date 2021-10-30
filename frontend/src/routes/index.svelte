<script lang="ts">
    import { getKeyByValue, routeToPage } from '../utils'
	import { variables } from '../variables.js'
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import MultiSelect from 'svelte-multiselect'
    import {currentCountry} from '../stores/country.js';
    import {currentProviders} from '../stores/providers.js';
    import {currentGenres} from "../stores/genres";
    import {inputQuery} from "../stores/input";
    import {onMount} from 'svelte';

    const SEARCH_URL: string = `${variables.apiPath}/search/`;
    const GENRE_URL: string = `${variables.apiPath}/genres/`;
    const PROVIDER_URL: string = `${variables.apiPath}/providers/`;
    const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
	const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
    const INPUT_TIMER: number = 200;
    const SHOWN_PROVIDERS: number = 5;
    const SHOW_BUTTON_AMOUNT: number = 21;
    const MEDIA_START_AMOUNT: number = 21;

    let input: string = '';
    let timer;
    let media = [];
    let selectedGenres = [];
    let providerAmounts: number[] = [];
    let formattedGenres: {} = {};
    let activeProviders = [];
    let currentMediaAmount: number = 21;

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        currentMediaAmount = MEDIA_START_AMOUNT;
        clearTimeout(timer);
        timer = setTimeout(() => {
            search()
        }, INPUT_TIMER);
    }

    // TODO: Replace any with a Media type
    const hitProviderAmounts = (searchHits: [any]) => {
        providerAmounts = [];
        searchHits.forEach(hit => {
            providerAmounts.push(hit.specific_providers.length);
        });
    };

    const search = async () => {
        // Builds the optional query for genres
        // Example: "?g=Action&g=Comedy&g=Drama"
        let query = '';
        for (let i = 0; i < selectedGenres.length; i++) {
            query += `&g=${getKeyByValue(formattedGenres, selectedGenres[i])}`;
        }
        for (let i = 0; i < $currentProviders.length; i++) {
            query += `&p=${$currentProviders[i]}`;
        }

        // Searches for all(*) if empty input
        const res = input !== '' ? await fetch(
            SEARCH_URL + input + "?c=" + $currentCountry + query + `&limit=${currentMediaAmount}`
        ) : await fetch(
            SEARCH_URL + '*' + "?c=" + $currentCountry + query + `&limit=${currentMediaAmount}`
        )
        $inputQuery = input;
        $currentGenres = selectedGenres;
        media = await res.json();
        hitProviderAmounts(media.hits);
    };

    const fetchProviders = async () => {
        const res = await fetch(PROVIDER_URL + $currentCountry);
        activeProviders = await res.json();
        return activeProviders;
    };

    const fetchGenres = async () => {
        const res = await fetch(GENRE_URL);
        return await res.json();
    };

    const resetProviders = () => {
        $currentProviders = [];
    };

    //TODO: This should be done prettier
    let firstLoadCompleted = false;
    $: if ($currentCountry) {
        if (firstLoadCompleted) {
            resetProviders();
            fetchProviders();
            search();

        }
        firstLoadCompleted = true;
    };

    const changeMediaAmount = (buttonElement: string) => {
        currentMediaAmount = buttonElement === 'loadmore' ? currentMediaAmount + SHOW_BUTTON_AMOUNT : currentMediaAmount - SHOW_BUTTON_AMOUNT;
        search()
    }

    const getFixedGenreValues = (genres: {}) => {
        formattedGenres = genres;
        return Object.keys(genres).map(function (key) {
            return genres[key];
        });
    }

    onMount(async () => {
        const inputField = document.getElementById('input-field')
        setTimeout(function () { inputField.select(); }, 100);

        if ($currentGenres !== []) {
            selectedGenres = $currentGenres
        }
        if ($inputQuery !== '') {
            input = $inputQuery;
            debounceInput();
        } else {
            await search();
        }
    });

</script>

<svelte:head>
    <title>Streamchaser</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar />
    <div class="mb-auto container mx-auto">
        <h1 class="text-center text-3xl pt-4">streamchaser</h1>
        <div class="form-control p-4">
            <input id="input-field"
                type="text"
                placeholder="Search in {$currentCountry}"
                class="input input-bordered"
                bind:value={input}
                on:input={debounceInput}
                autofocus
            />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 py-1 px-4">
            {#await fetchGenres()}
                <p>...loading selection</p>
            {:then genres}
                <MultiSelect --sms-options-bg="var(--my-css-var, #404454)"
                    bind:selected={selectedGenres}
                    on:change={debounceInput}
                    options={getFixedGenreValues(genres)}
                    placeholder="Select genres..."
                />
            {:catch error}
                <p>Select error! {error}</p>
            {/await}

            {#await fetchProviders()}
                <p>...loading selection</p>
            {:then}
                <MultiSelect --sms-options-bg="var(--my-css-var, #404454)"
                    bind:selected={$currentProviders}
                    on:change={debounceInput}
                    options={activeProviders}
                    placeholder="Select providers..."
                />
            {:catch error}
                <p>Select error! {error}</p>
            {/await}
        </div>
        {#if media.hits}
            {#if media.hits.length > 0}
                <div class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-2 p-4 bg-base-100">
                    {#each media.hits as media, mediaIndex}
                        <div on:click={routeToPage(media.id)}
                            class="card compact bordered w-auto transition duration-500 ease-in-out cursor-pointer transform hover:scale-110 m-1">
                            <figure>
                                <img src="{LOW_RES_IMG_URL}{media.poster_path}" alt="media poster"/>
                            </figure>
                            {#if providerAmounts[mediaIndex] === 0}
                                <div class="card-body">
                                    <p class="text-center"><strong>No providers
                                        in {$currentCountry}</strong></p>
                                </div>
                            {:else if providerAmounts[mediaIndex] <= SHOWN_PROVIDERS}
                                <div class="-space-x-4 avatar-group">
                                    {#each media.specific_providers as provider}
                                        <div class="avatar">
                                            <div class="w-12 h-12">
                                                <img src="{IMG_URL}{provider.logo_path}"
                                                    alt="provider logo">
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                            {:else}
                                <div class="-space-x-4 avatar-group">
                                    {#each media.specific_providers.slice(0, SHOWN_PROVIDERS - 1) as provider}
                                        <div class="avatar">
                                            <div class="w-12 h-12">
                                                <img src="{IMG_URL}{provider.logo_path}"
                                                    alt="provider logo">
                                            </div>
                                        </div>
                                    {/each}
                                    <div class="avatar placeholder">
                                        <div class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                                            <span>+{providerAmounts[mediaIndex] -  + 1}</span>
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
                            on:click={() => { changeMediaAmount('loadmore') }}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show more
                        </button>
                    {/if}
                    {#if currentMediaAmount > MEDIA_START_AMOUNT}
                        <button
                            on:click={() => { changeMediaAmount('loadless') }}
                            id="loadless"
                            type="button"
                            class="btn">
                            Show less
                        </button>
                    {/if}
                </div>
            {:else}
                <div class="flex justify-around">
                    <p>No results for: {input}</p>
                </div>
            {/if}
        {/if}
    </div>
    <Footer/>
</div>
