<script>
	import { variables } from '../../variables.js'
	import { page } from '$app/stores';
	import { currentCountry } from '../../stores/country.js';
	import Navbar from '../../components/navbar.svelte';
	import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';

	const MOVIE_DETAIL_URL = `${variables.apiPath}/movie/${$currentCountry}/${$page.params.id}`;
	const IMG_URL = 'https://image.tmdb.org/t/p/original/';
	let currentItems = 20;

	const fetchMovieDetails = async () => {
		try {
			const response = await fetch(MOVIE_DETAIL_URL);
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	let firstLoadCompleted = false;

	$: if($currentCountry) {
        if (firstLoadCompleted) {
        	location.reload();
        }
        firstLoadCompleted = true;
    }

	function routeToPage(mediaId) {
        goto(`/movie/${mediaId}`)
        location.reload()
    }

	function routeToPerson(mediaId){
        goto(`/person/${mediaId}`)
        location.reload()
    }
</script>

<Navbar />

<div class="container mx-auto pb-2">
	{#await fetchMovieDetails()}
		<p>Loading...</p>
	{:then movie}
		<!-- Movie -->
		<div
			class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
			style="background-image: url(&quot;{IMG_URL}{movie.backdrop_path}&quot;);e"
		>
			<div class="card glass lg:card-side text-neutral-content">
				<figure class="p-6">
					<img
						src="{IMG_URL}{movie.poster_path}"
						class="object-contain h-96 w-full rounded-lg"
						alt="lol du kan ikke se"
					/>
				</figure>
				<div class="max-w-md card-body">
					<h2 class="card-title">{movie.title}</h2>
					<p>{movie.overview}</p>
					<div class="flex-nowrap pt-5">
						<div class="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row">
							{#each movie.genres as genre}
								<div class="badge">{genre}</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<!-- Providers -->
			<div class="flex-nowrap pt-5">
				{#each movie.providers as provider}
					<div class="avatar p-2">
						<div class="mb-8 w-24 h-24 mask mask-squircle">
							<img src="{IMG_URL}{provider.logo_path}" alt="lol du kan ikke se" />
						</div>
					</div>
				{/each}
			</div>
		</div>
		<!-- Person -->
		{#if movie.cast.length != 0}
			<h1 class="text-center text-3xl pt-5">Cast</h1>
			<div class="grid grid-cols-3 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
				{#each movie.cast.slice(0, currentItems) as person}
					{#if person.profile_path != undefined}
						<div on:click={() => routeToPerson(person.id)} class="card compact cursor-pointer bordered">
							<figure>
							<img src="{IMG_URL}{person.profile_path}" alt="{person.name}">
							</figure> 
							<div class="card-body">
							<p><b>{person.name}</b> - <i>{person.character}</i></p> 
							</div>
						</div>
					{/if}
				{/each}
			</div>
			{#if currentItems < movie.cast.length}
				<div class="flex justify-center pt-1">
					<button
						on:click={() => currentItems = currentItems + 20}
						id="loadmore"
						type="button"
						class="btn">
						Show more
					</button>
				</div>
			{/if}
		{/if}
		<!-- Recommendations -->
		{#if movie.recommendations.length != 0}
            <h1 class="text-center text-3xl pt-5">Recommendations</h1>
            <div class="pt-5">
                <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
                {#each movie.recommendations as recommendation}
                    <div on:click={() => routeToPage(recommendation.id)} class="carousel-item h-96 w-64 p-1">
                        <img src="{IMG_URL}{recommendation.poster_path}" class="rounded-lg cursor-pointer"
							 alt="{recommendation.title}">
                    </div>
                {/each}
            </div>
        </div>
		{/if}
	{/await}
</div>

<Footer />
