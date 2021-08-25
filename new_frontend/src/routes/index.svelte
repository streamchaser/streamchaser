<script>
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import {currentCountry} from '../store.js';

    const searchUrl = 'http://localhost:1337/search/';
    const genreUrl = 'http://localhost:1337/genres/';
    const providerUrl = 'http://localhost:1337/providers/';
    const imageUrl = 'https://image.tmdb.org/t/p/w500/';
    const inputTimer = 200;
    const shownProviders = 5;

    let input = '';
    let timer;
    let media = [];
    let currentProviders;
    let selectedGenres;
    let selectedProviders;
    let mappedSelectedGenres;
    let mappedSelectedProviders;
    let providerAmounts = [];

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, inputTimer);
    }

    $: mappedSelectedGenres = selectedGenres ? selectedGenres.map(item => item.value) : [];
    $: mappedSelectedProviders = selectedProviders ? selectedProviders.map(item => item.value) : [];

    const hitProviderAmounts = (searchHits) => {
        providerAmounts = [];
        searchHits.forEach(hit => {
            providerAmounts.push(hit.specific_providers.length);
        });
    };

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

            const res = await fetch(searchUrl + input + '?c=' + $currentCountry + genre_query);
            media = await res.json();
            hitProviderAmounts(media.hits);
        }
    };

    const fetchProviders = async () => {
        const res = await fetch(providerUrl + $currentCountry);
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
                {#each media.hits as media, mediaIndex}
                    <div class="card compact bordered w-auto">
                        <figure>
                            <img src="{imageUrl}{media.poster_path}" alt="media poster"/>
                        </figure>
                        <div class="-space-x-4 avatar-group">
                            {#if providerAmounts[mediaIndex] <= shownProviders}
                                {#each media.specific_providers as provider}
                                    <div class="avatar">
                                        <div class="w-12 h-12">
                                            <img src="{imageUrl}{provider.logo_path}" alt="provider logo">
                                        </div>
                                    </div>
                                {/each}
                            {:else}
                                {#each media.specific_providers.slice(0, shownProviders-1) as provider}
                                    <div class="avatar">
                                        <div class="w-12 h-12">
                                            <img src="{imageUrl}{provider.logo_path}" alt="provider logo">
                                        </div>
                                    </div>
                                {/each}
                                <div class="avatar placeholder">
                                    <div class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                                        <span>+{providerAmounts[mediaIndex] - shownProviders+1}</span>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>


    <Footer/>
</div>