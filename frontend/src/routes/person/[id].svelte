<script>
    import { variables } from '../../variables.js'
    import {page} from '$app/stores';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';

    const PERSON_DETAIL_URL = `${variables.apiPath}/person/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';
    let currentMovieItems  = 10;
    let currentTVItems  = 10;


    const fetchPersonDetails = async () => {
        try {
            const response = await fetch(PERSON_DETAIL_URL);
            return await response.json();
        } catch (error) {
            console.error(error);
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
			<div class="grid grid-cols-2 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
				{#each person.movie_credits.slice(0, currentMovieItems) as movie}
					{#if movie.poster_path != undefined}
						<div on:click={() => routeToMovie(movie.id)} class="card compact cursor-pointer bordered">
							<figure>
							    <img src="{IMG_URL}{movie.poster_path}" alt="{movie.title}">
							</figure> 
						</div>
					{/if}
				{/each}
			</div>
			{#if currentMovieItems < person.movie_credits.length}
				<div class="flex justify-center pt-1">
					<button
						on:click={() => currentMovieItems = currentMovieItems + 10}
						id="loadmore"
						type="button"
						class="btn">
						Show more
					</button>
				</div>
			{/if}
		{/if}

            <!-- TV -->
        {#if person.tv_credits.length != 0}
            <h1 class="text-center text-3xl pt-5">TV Shows</h1>
            <div class="grid grid-cols-2 2xl:grid-cols-8 xl:grid-cols-7 lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
                {#each person.tv_credits.slice(0, currentTVItems) as tv}
                    {#if tv.poster_path != undefined}
                        <div on:click={() => routeToTV(tv.id)} class="card compact cursor-pointer bordered">
                            <figure>
                                <img src="{IMG_URL}{tv.poster_path}" alt="{tv.name}">
                            </figure> 
                        </div>
                    {/if}
                {/each}
            </div>
            {#if currentTVItems < person.tv_credits.length}
                <div class="flex justify-center pt-1">
                    <button
                        on:click={() => currentTVItems = currentTVItems + 10}
                        id="loadmore"
                        type="button"
                        class="btn">
                        Show more
                    </button>
                </div>
            {/if}
        {/if}
    {/await}
</div>

<Footer/>
