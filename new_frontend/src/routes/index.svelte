<script>
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import {currentCountry} from '../store.js';

    const search_url = 'http://localhost:1337/search/';
    const genre_url = 'http://localhost:1337/genres/';
    const PROVIDER_URL = 'http://localhost:1337/providers/';
    const IMG_URL = 'https://image.tmdb.org/t/p/w500/';
    const INPUT_TIMER = 200;

    let input = '';
    let timer;
    let media = [];
    let currentProviders;
    let selectedGenres;
    let selectedProviders;
    let mappedSelectedGenres;
    let mappedSelectedProviders;

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, INPUT_TIMER);
    }

    $: mappedSelectedGenres = selectedGenres ? selectedGenres.map(item => item.value) : [];
    $: mappedSelectedProviders = selectedProviders ? selectedProviders.map(item => item.value) : [];


    const search = async () => {
        // Builds the optional query for genres
        // Example: "?g=Action&g=Comedy&g=Drama"
        if (input) {
            let genre_query = '';
            for (let i = 0; i < mappedSelectedGenres.length; i++) {
                genre_query += `&g=${mappedSelectedGenres[i]}`;
            }
            for (let i = 0; i < mappedSelectedProviders.length; i++) {
                genre_query += `&p=${mappedSelectedProviders[i]}`;
            }

            const res = await fetch(search_url + input + '?c=' + $currentCountry + genre_query);
            media = await res.json();
        }
    };

    const fetchProviders = async () => {
        const res = await fetch(PROVIDER_URL + $currentCountry);
        currentProviders = await res.json()
    }

    function resetProviders() {
        selectedProviders = undefined
        mappedSelectedProviders = []
    }

    $: if ($currentCountry) {
        // resetProviders()
        // fetchProviders()
        search()
    }

</script>

<div class="flex flex-col h-screen justify-between">
    <Navbar/>
    <div class="mb-auto container mx-auto">
        <h1 class="text-center text-3xl pt-4">streamchaser</h1>
        <div class="form-control pt-4">
            <input
                    type="text"
                    placeholder="Search in {$currentCountry}"
                    class="input input-bordered"
                    bind:value={input}
                    on:input={debounceInput}>
        </div>
        {#if media.hits}
            <div class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-2 p-2 pt-4 bg-base-100">
                {#each media.hits as media}
                    <div class="card compact bordered w-auto">
                        <figure>
                            <img src="{IMG_URL}{media.poster_path}" alt="haha du kan ikke se"/>
                        </figure>
                        <div class="-space-x-4 avatar-group">
                            {#each media.specific_providers as provider}
                                <div class="avatar">
                                    <div class="w-12 h-12">
                                        <img src="{IMG_URL}{provider.logo_path}">
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>


    <Footer/>
</div>