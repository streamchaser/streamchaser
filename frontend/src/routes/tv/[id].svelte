<script lang="ts">
    import { removeContentWithMissingImagePath, routeToPage, sortListByPopularity } from '../../utils'
    import {variables} from '../../variables.js'
    import {page} from '$app/stores';
    import {currentCountry} from '../../stores/country.js';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import Seasons from '../../components/details/seasons.svelte';
    import Error from '../../components/error.svelte';
    import Person from '../../components/details/person.svelte';
    import CookieDisclaimer from '../../components/cookie_disclaimer.svelte'
    import DetailsTopCard from '../../components/details/top_card.svelte'
    import Recommendations from '../../components/details/recommendations.svelte'


    const TV_DETAIL_URL: string = `${variables.apiPath}/tv/${$currentCountry}/${$page.params.id}`;
    const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
    const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
	const SHOW_BUTTON_AMOUNT: number = 18;
	const CAST_ITEM_START_AMOUNT: number = 9;
    const INITIAL_DESCRIPTION_LENGTH = 500;

    let tvTitle = 'Loading...';
    let currentDescriptionLength = INITIAL_DESCRIPTION_LENGTH;

    const fetchTVDetails = async () => {
		const response = await fetch(TV_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			tvTitle = jsonResponse.name;

            removeContentWithMissingImagePath(jsonResponse.cast, "profile_path");
			sortListByPopularity(jsonResponse.cast);

			return jsonResponse;
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

</script>

<svelte:head>
    <title>{tvTitle} - Streamchaser</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar/>
    <div class="container mx-auto pb-2">
        {#await fetchTVDetails()}
            <p>Loading...</p>
        {:then tv}
            <DetailsTopCard
                backdropPath={tv.backdrop_path}
                imgUrl={IMG_URL}
                posterPath={tv.poster_path}
                title={tv.name}
                overview={tv.overview}
                overviewLength={currentDescriptionLength}
                initialOverviewLength={INITIAL_DESCRIPTION_LENGTH}
                genres={tv.genres}
                providers={tv.providers}
            />

            <Seasons seasons={tv.seasons} />

            <Person
                media={tv}
                imgUrl={LOW_RES_IMG_URL}
                showButtonAmount={SHOW_BUTTON_AMOUNT}
                castItemStartAmount={CAST_ITEM_START_AMOUNT}
            />

            <Recommendations
                recommendations={tv.recommendations}
                imgUrl={IMG_URL}
            />
        {:catch error}
            <Error error={error} />
        {/await}
    </div>
    <Footer/>
</div>
<CookieDisclaimer />
