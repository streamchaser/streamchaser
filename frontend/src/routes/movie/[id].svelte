<script lang="ts">
	import { removeContentWithMissingImagePath, routeToPage, sortListByPopularity } from '../../utils'
	import { variables } from '../../variables.js'
	import { page } from '$app/stores';
	import { currentCountry } from '../../stores/country.js';
	import Navbar from '../../components/navbar.svelte';
	import Footer from '../../components/footer.svelte';
    import Error from '../../components/error.svelte';
    import Person from '../../components/person.svelte';

	const MOVIE_DETAIL_URL: string = `${variables.apiPath}/movie/${$currentCountry}/${$page.params.id}`;
	const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
	const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
	const SHOW_BUTTON_AMOUNT: number = 18;
	const CAST_ITEM_START_AMOUNT: number = 9;

	let movieTitle: string = 'Loading...';

	const fetchMovieDetails = async () => {
		const response = await fetch(MOVIE_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			movieTitle = jsonResponse.title;

			removeContentWithMissingImagePath(jsonResponse.cast, "profile_path");
			sortListByPopularity(jsonResponse.cast);

			return jsonResponse;
		} else {
			console.error(response.statusText);
			movieTitle = 'Error loading movie'
			throw new Error(response.statusText)
		}
	};

	let firstLoadCompleted = false;

	$: if($currentCountry) {
        if (firstLoadCompleted) {
        	location.reload();
        }
        firstLoadCompleted = true;
    }

</script>

<svelte:head>
    <title>{movieTitle} - Streamchaser</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
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
                            alt="{movie.title}"
						/>
					</figure>
					<div class="max-w-md card-body">
						<h2 class="card-title">{movie.title}</h2>
						<p>{movie.overview}</p>
						<div class="flex-wrap mt-2">
							{#each movie.genres as genre}
								<div class="badge mx-2">{genre}</div>
							{/each}
						</div>
					</div>
				</div>
				<!-- Providers -->
				<div class="flex-nowrap pt-5">
					{#each movie.providers as provider}
						<div class="avatar p-2">
							<div class="mb-8 w-24 h-24 mask mask-squircle">
                                <img src="{IMG_URL}{provider.logo_path}" alt="{provider.provider_name}" />
							</div>
						</div>
					{/each}
				</div>
			</div>

			<Person media={movie} imgUrl={LOW_RES_IMG_URL} showButtonAmount={SHOW_BUTTON_AMOUNT} castItemStartAmount={CAST_ITEM_START_AMOUNT} />

			<!-- Recommendations -->
			{#if movie.recommendations.length != 0}
				<h1 class="text-center text-3xl pt-5">Recommendations</h1>
				<div class="pt-5">
					<div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
					{#each movie.recommendations as recommendation}
						{#if recommendation.poster_path}
							<div on:click={() => routeToPage(recommendation.id, "movie")} class="carousel-item h-96 w-64 p-1">
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
