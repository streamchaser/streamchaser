<script>
	import { page } from '$app/stores';
	import { currentCountry } from '../../stores/country.js';
	import Navbar from '../../components/navbar.svelte';
	import Footer from '../../components/footer.svelte';

	const MOVIE_DETAIL_URL = `http://localhost:1337/movie/${$currentCountry}/${$page.params.id}`;
	const IMG_URL = 'https://image.tmdb.org/t/p/original/';

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

</script>

<Navbar />

<div class="container mx-auto">
	{#await fetchMovieDetails()}
		<p>Loading...</p>
	{:then movie}
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

		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th />
						<th>Title</th>
						<th>Language</th>
						<th>Release date</th>
					</tr>
				</thead>
				<tbody>
					{#each movie.recommendations as recommendation, i}
						<tr>
							<th {i} />
							<th>{recommendation.title}</th>
							<th>{recommendation.original_language}</th>
							<th>{recommendation.release_date}</th>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/await}
</div>

<Footer />
