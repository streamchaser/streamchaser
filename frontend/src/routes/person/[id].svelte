<script>
    import { variables } from '../../variables.js'
    import {page} from '$app/stores';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';
    import Error from '../../components/error.svelte';

    const PERSON_DETAIL_URL = `${variables.apiPath}/person/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';
    const LOW_RES_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
    const SHOW_BUTTON_AMOUNT = 12;
    const CAST_ITEM_START_AMOUNT = 6;
    let currentMovieAmount  = 6;
    let currentTVAmount = 6;
    let personName = 'Loading...';

    const fetchPersonDetails = async () => {
		const response = await fetch(PERSON_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			personName = jsonResponse.title;
			return await jsonResponse;
		} else {
			console.error(response.statusText);
			personName = 'Error loading movie'
			throw new Error(response.statusText)
		}
    };

    function routeToMovie(mediaId) {
        goto(`/movie/${mediaId}`)
        location.reload()
    }

    function routeToTV(mediaId) {
        goto(`/tv/${mediaId}`)
        location.reload()
    }

</script>

<svelte:head>
    <title>{personName}</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar/>
    <div class="container mx-auto pb-2">
        {#await fetchPersonDetails()}
            <p>Loading...</p>
        {:then person}
            <div
            class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
            style="background-image: url(&quot;{IMG_URL}{person.movie_credits[0].backdrop_path}&quot;);e"
            >
                <div class="card glass lg:card-side text-neutral-content">
                    <figure class="p-6">
                        <img
                                src="{IMG_URL}{person.profile_path}"
                                class="object-contain h-96 w-full rounded-lg"
                                alt="Poster path for tv series"
                        />
                    </figure>
                    <div class="max-w-md card-body">
                        <h2 class="card-title">{person.name}</h2>
                        <p>{person.biography}</p>
                    </div>
                </div>
            </div>

            <!-- Movie -->
            {#if person.movie_credits.length != 0}
                <h1 class="text-center text-3xl pt-5">Movies</h1>
                <div class="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
                    {#each person.movie_credits.slice(0, currentMovieAmount) as movie}
                        {#if movie.poster_path}
                            <div on:click={() => routeToMovie(movie.id)} class="card compact cursor-pointer bordered">
                                <figure>
                                    <img src="{LOW_RES_IMG_URL}{movie.poster_path}" alt="{movie.title}">
                                </figure> 
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="flex space-x-1 justify-center p-1">
                    {#if currentMovieAmount < person.movie_credits.length}
                        <button
                            on:click={() => currentMovieAmount = currentMovieAmount + SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show more
                        </button>
                    {/if}
                    {#if currentMovieAmount > CAST_ITEM_START_AMOUNT}
                        <button
                            on:click={() => currentMovieAmount = currentMovieAmount - SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show less
                        </button>
                    {/if}
                </div>
            {/if}

            <!-- TV -->
            {#if person.tv_credits.length != 0}
                <h1 class="text-center text-3xl pt-5">Series</h1>
                <div class="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
                    {#each person.tv_credits.slice(0, currentTVAmount) as tv}
                        {#if tv.poster_path}
                            <div on:click={() => routeToTV(tv.id)} class="card compact cursor-pointer bordered">
                                <figure>
                                    <img src="{LOW_RES_IMG_URL}{tv.poster_path}" alt="{tv.name}">
                                </figure>
                            </div>
                        {/if}
                    {/each}
                </div>
                <div class="flex space-x-1 justify-center p-1">
                    {#if currentTVAmount < person.tv_credits.length}
                        <button
                            on:click={() => currentTVAmount = currentTVAmount + SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show more
                        </button>
                    {/if}
                    {#if currentTVAmount > CAST_ITEM_START_AMOUNT}
                        <button
                            on:click={() => currentTVAmount = currentTVAmount - SHOW_BUTTON_AMOUNT}
                            id="loadmore"
                            type="button"
                            class="btn">
                            Show less
                        </button>
                    {/if}
                </div>
            {/if}
        {:catch error}
            <Error error={error} />
        {/await}
    </div>
<Footer/>
</div>