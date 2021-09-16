<script>
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import MultiSelect from 'svelte-multiselect'
    import {currentCountry} from '../stores/country.js';
    import {goto} from '$app/navigation';

    const searchUrl = 'http://localhost:1337/search/';
    const genreUrl = 'http://localhost:1337/genres/';
    const providerUrl = 'http://localhost:1337/providers/';
    const imageUrl = 'https://image.tmdb.org/t/p/w500/';
    const inputTimer = 200;
    const shownProviders = 5;

    let input = '';
    let timer;
    let media = [];
    let currentProviders = [];
    let selectedGenres = [];
    let selectedProviders = [];
    let providerAmounts = [];

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, inputTimer);
    }

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
            let query = '';
            for (let i = 0; i < selectedGenres.length; i++) {
                query += `&g=${selectedGenres[i]}`;
            }
            for (let i = 0; i < selectedProviders.length; i++) {
                query += `&p=${selectedProviders[i]}`;
            }

            const res = await fetch(
                searchUrl + input + "?c=" + $currentCountry + query
            );
            media = await res.json();
            hitProviderAmounts(media.hits);
        }
    };

    const fetchProviders = async () => {
        const res = await fetch(providerUrl + $currentCountry);
        currentProviders = await res.json();
        return currentProviders;
    };

    const fetchGenres = async () => {
        const res = await fetch(genreUrl);
        return await res.json();
    };

    function resetProviders() {
        selectedProviders = [];
    };

    $: if ($currentCountry) {
        resetProviders();
        fetchProviders();
        search();
    };

    function routeToPage(mediaId, replaceState) {
        if (mediaId.startsWith('m')) {
            goto(`/movie/${$currentCountry}/${mediaId.slice(1)}`, {replaceState})
        } else {
            goto(`/tv/${$currentCountry}/${mediaId.slice(1)}`, {replaceState})
        }
    }

</script>

<div class="flex flex-col h-screen justify-between">
    <Navbar />
    <div class="mb-auto container mx-auto">
        <h1 class="text-center text-3xl pt-4">streamchaser</h1>
        <div class="form-control p-4">
            <input
                type="text"
                placeholder="Search in {$currentCountry}"
                class="input input-bordered"
                bind:value={input}
                on:input={debounceInput}
                autofocus
            />
        </div>
        <div class="grid grid-cols-1 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-2 pb-1 pt-1 pr-2 pl-2">
            {#await fetchGenres()}
                <p>...loading selection</p>
            {:then genres}
                <MultiSelect class="select-primary" --sms-options-bg="var(--my-css-var, #404454)"
                    bind:selected={selectedGenres}
                    on:change={debounceInput}
                    options={genres}
                    placeholder="Select genres..."
                />
            {:catch error}
                <p>Select error! {error}</p>
            {/await}

            {#await fetchProviders()}
                <p>...loading selection</p>
            {:then}
                <MultiSelect class="select-primary" --sms-options-bg="var(--my-css-var, #404454)"
                    bind:selected={selectedProviders}
                    on:change={debounceInput}
                    options={currentProviders}
                    placeholder="Select providers..."
                />
            {:catch error}
                <p>Select error! {error}</p>
            {/await}
        </div>
        {#if media.hits}
            <div class="grid grid-cols-2 2xl:grid-cols-7 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-2 p-2 pt-4 bg-base-100">
                {#each media.hits as media, mediaIndex}
                    <div on:click={routeToPage(media.id)}
                         class="card compact bordered w-auto transition duration-500 ease-in-out cursor-pointer transform hover:scale-110 m-1">
                        <figure>
                            <img src="{imageUrl}{media.poster_path}" alt="media poster"/>
                        </figure>
                        {#if providerAmounts[mediaIndex] === 0}
                            <div class="card-body">
                                <p class="text-center"><strong>No providers
                                    in {$currentCountry}</strong></p>
                            </div>
                        {:else if providerAmounts[mediaIndex] <= shownProviders}
                            <div class="-space-x-4 avatar-group">
                                {#each media.specific_providers as provider}
                                    <div class="avatar">
                                        <div class="w-12 h-12">
                                            <img src="{imageUrl}{provider.logo_path}"
                                                 alt="provider logo">
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="-space-x-4 avatar-group">
                                {#each media.specific_providers.slice(0, shownProviders - 1) as provider}
                                    <div class="avatar">
                                        <div class="w-12 h-12">
                                            <img src="{imageUrl}{provider.logo_path}"
                                                 alt="provider logo">
                                        </div>
                                    </div>
                                {/each}
                                <div class="avatar placeholder">
                                    <div class="w-12 h-12 rounded-full bg-neutral-focus text-neutral-content">
                                        <span>+{providerAmounts[mediaIndex] - shownProviders + 1}</span>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>


    <Footer/>
</div>
