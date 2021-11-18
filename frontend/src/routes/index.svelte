<script lang="ts">
    import { getKeyByValue, routeToPage, getFixedGenreValues } from '../utils'
	import { variables } from '../variables.js'
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import CookieDisclaimer from '../components/cookie_disclaimer.svelte'
    import MultiSelect from 'svelte-multiselect'
    import MediaSearch from '../components/media_search.svelte'
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
    let formattedGenres: {} = {'':''};
    let activeProviders = [''];
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
    };

    const fetchGenres = async () => {
        const res = await fetch(GENRE_URL);
        formattedGenres = await res.json();
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

    onMount(async () => {
        const inputField = document.getElementById('input-field')
        setTimeout(function () { inputField.select(); }, 20);

        await fetchGenres();
        await fetchProviders();

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
        <div class="form-control pb-2 pt-4 px-4">
            <input id="input-field"
                type="text"
                placeholder="Search in {$currentCountry}"
                class="input input-bordered"
                bind:value={input}
                on:input={debounceInput}
                autofocus
            />
        </div>
        <div class="sm:grid sm:grid-cols-2 sm:gap-2 px-4">
            <MultiSelect
                --sms-options-bg="#2a2e37"
                --sms-border="1pt solid #6B7280"
                --sms-focus-border="2pt solid #6B7280"
                --sms-active-color="#2a2e37"
                --sms-remove-x-hover-focus-color="#6B7280"
                --sms-li-selected-bg="#3d4451"
                --sms-li-active-bg="#059669"
                bind:selected={selectedGenres}
                on:change={debounceInput}
                options={getFixedGenreValues(formattedGenres)}
                placeholder="Select genres..."
            />
            <MultiSelect
                --sms-options-bg="#2a2e37"
                --sms-border="1pt solid #6B7280"
                --sms-focus-border="2pt solid #6B7280"
                --sms-active-color="#2a2e37"
                --sms-remove-x-hover-focus-color="#6B7280"
                --sms-li-selected-bg="#3d4451"
                --sms-li-active-bg="#059669"
                bind:selected={$currentProviders}
                on:change={debounceInput}
                options={activeProviders}
                placeholder="Select providers..."
            />
        </div>

        <MediaSearch
            media={media}
            lowResUrl={LOW_RES_IMG_URL}
            imgUrl={IMG_URL}
            providerAmounts={providerAmounts}
            currentCountry={$currentCountry}
            shownProviders={SHOWN_PROVIDERS}
            currentProviders={$currentProviders}
            bind:currentMediaAmount={currentMediaAmount}
            mediaStartAmount={MEDIA_START_AMOUNT}
            showButtonAmount={SHOW_BUTTON_AMOUNT}
            input={input}
            currentGenres={$currentGenres}
            search={search}
        />
    </div>
    <Footer/>
</div>
<CookieDisclaimer />
