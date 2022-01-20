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
    import TopCard from '../../components/details/top_card.svelte'
    import Recommendations from '../../components/details/recommendations.svelte'
	import Spinner from '../../components/loading/spinner.svelte'


	const MOVIE_DETAIL_URL: string = `${variables.apiPath}/movie/${$currentCountry}/${$page.params.id}`;

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
			<Spinner />
		{:then movie}
			<TopCard
				backdropPath={movie.backdrop_path}
				posterPath={movie.poster_path}
				title={movie.title}
				overview={movie.overview}
				genres={movie.genres}
				providers={movie.providers}
				runtime={movie.runtime}
				imdbId={movie.imdb_id}
				releaseDate={movie.release_date}
			/>

			<Person cast={movie.cast}/>

			<Recommendations
				recommendations={movie.recommendations}
				mediaType={'movie'}
			/>
		{:catch error}
			<Error error={error} />
		{/await}
	</div>
	<Footer/>
</div>
<CookieDisclaimer />
