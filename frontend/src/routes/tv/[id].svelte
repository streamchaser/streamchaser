<script>
    import {variables} from '../../variables.js'
    import {page} from '$app/stores';
    import {currentCountry} from '../../stores/country.js';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';
    import Seasons from '../../components/seasons.svelte';
    import Error from '../../components/error.svelte';


    const TV_DETAIL_URL = `${variables.apiPath}/tv/${$currentCountry}/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';
    const LOW_RES_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
	const SHOW_BUTTON_AMOUNT = 18;
	const CAST_ITEM_START_AMOUNT = 9;
	let castItemAmount = 9;
    let tvTitle = 'Loading...';

    const fetchTVDetails = async () => {
		const response = await fetch(TV_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			tvTitle = jsonResponse.title;
			return await jsonResponse;
		} else {
			console.error(response.statusText);
			tvTitle = 'Error loading tv'
			throw new Error(response.statusText)
		}
    };

    let firstLoadCompleted = false;

    $: if ($currentCountry) {
        if (firstLoadCompleted) {
            location.reload();
        }
        firstLoadCompleted = true;
    }

    function routeToPage(mediaId) {
        goto(`/tv/${mediaId}`)
        location.reload()
    }

    function routeToPerson(mediaId) {
        goto(`/person/${mediaId}`)
        location.reload()
    }

</script>

<svelte:head>
    <title>{tvTitle}</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar/>
    <div class="container mx-auto pb-2">
        {#await fetchTVDetails()}
            <p>Loading...</p>
        {:then tv}
            <!-- TV -->
            <div
                    class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
                    style="background-image: url(&quot;{IMG_URL}{tv.backdrop_path}&quot;);e"
            >
                <div class="card glass lg:card-side text-neutral-content">
                    <figure class="p-6">
                        <img
                                src="{IMG_URL}{tv.poster_path}"
                                class="object-contain h-96 w-full rounded-lg"
                                alt="Poster path for tv series"
                        />
                    </figure>
                    <div class="max-w-md card-body">
                        <h2 class="card-title">{tv.name}</h2>
                        <p>{tv.overview}</p>
                        <div class="flex-nowrap pt-5">
                            <div class="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row">
                                {#each tv.genres as genre}
                                    <div class="badge">{genre}</div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Provider -->
                <div class="flex-nowrap pt-5">
                    {#each tv.providers as provider}
                        <div class="avatar p-2">
                            <div class="mb-8 w-24 h-24 mask mask-squircle">
                                <img src="{IMG_URL}{provider.logo_path}" alt="Provider logo"/>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <Seasons seasons={tv.seasons} />

            <!-- Person -->
            {#if tv.cast.length != 0}
                <h1 class="text-center text-3xl pt-5">Cast</h1>
                <div class="grid grid-cols-3 2xl:grid-cols-9 xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
                    {#each tv.cast.slice(0, castItemAmount) as person}
                        {#if person.profile_path}
                            <div on:click={() => routeToPerson(person.id)} class="card compact cursor-pointer bordered">
                                <figure>
                                <img src="{LOW_RES_IMG_URL}{person.profile_path}" alt="{person.name}">
                                </figure> 
                                <div class="card-body">
                                <p><b>{person.name}</b> - <i>{person.character}</i></p> 
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="flex space-x-1 justify-center p-1">
                    {#if castItemAmount < tv.cast.length}
                        <button
                            on:click={() => castItemAmount = castItemAmount + SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show more
                        </button>
                    {/if}
                    {#if castItemAmount > CAST_ITEM_START_AMOUNT}
                        <button
                            on:click={() => castItemAmount = castItemAmount - SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show less
                        </button>
                    {/if}
                </div>
            {/if}
            <!-- Recommendations -->
            {#if tv.recommendations.length != 0}
                <h1 class="text-center text-3xl pt-5">Recommendations</h1>
                <div class="pt-5">
                    <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
                    {#each tv.recommendations as recommendation}
                        {#if recommendation.poster_path}
                            <div on:click={() => routeToPage(recommendation.id)} class="carousel-item h-96 w-64 p-1">
                                <img src="{IMG_URL}{recommendation.poster_path}" class="rounded-lg cursor-pointer" 
                                    alt="{recommendation.title}">
                            </div>
                        {/if}
                    {/each}
                </div>
            </div>
            {/if}
        {:catch error}
            <Error error={error} />
        {/await}
    </div>
    <Footer/>
</div>
