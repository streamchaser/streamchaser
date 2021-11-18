<script lang="ts">
	import { removeContentWithMissingImagePath, routeToPage, sortListByPopularity } from '../../utils'
	import { variables } from '../../variables.js'
	import { page } from '$app/stores';
	import { currentCountry } from '../../stores/country.js';
	import Navbar from '../../components/navbar.svelte';
	import Footer from '../../components/footer.svelte';
    import Error from '../../components/error.svelte';
    import Person from '../../components/details/person.svelte';
    import CookieDisclaimer from '../../components/cookie_disclaimer.svelte'
    import DetailsTopCard from '../../components/details/top_card.svelte'
    import Recommendations from '../../components/details/recommendations.svelte'


	const MOVIE_DETAIL_URL: string = `${variables.apiPath}/movie/${$currentCountry}/${$page.params.id}`;
	const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
	const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
	const SHOW_BUTTON_AMOUNT: number = 18;
	const CAST_ITEM_START_AMOUNT: number = 9;
    const INITIAL_DESCRIPTION_LENGTH = 500;

	let movieTitle: string = 'Loading...';
    let currentDescriptionLength = INITIAL_DESCRIPTION_LENGTH;

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
			<DetailsTopCard
				backdropPath={movie.backdrop_path}
				imgUrl={IMG_URL}
				posterPath={movie.poster_path}
				title={movie.title}
				overview={movie.overview}
				overviewLength={currentDescriptionLength}
				initialOverviewLength={INITIAL_DESCRIPTION_LENGTH}
				genres={movie.genres}
				providers={movie.providers}
			/>

			<Person
				media={movie}
				imgUrl={LOW_RES_IMG_URL}
				showButtonAmount={SHOW_BUTTON_AMOUNT}
				castItemStartAmount={CAST_ITEM_START_AMOUNT}
			/>

			<Recommendations
				recommendations={movie.recommendations}
				imgUrl={IMG_URL}
			/>
		{:catch error}
			<Error error={error} />
		{/await}
	</div>
	<Footer/>
</div>
<CookieDisclaimer />
