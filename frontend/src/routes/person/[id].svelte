<script lang="ts">
    import { removeContentWithMissingImagePath, sortListByPopularity, removeDuplicates } from '../../utils'
    import { variables } from '../../variables.js'
    import {page} from '$app/stores';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import Error from '../../components/error.svelte';
    import CookieDisclaimer from '../../components/cookie_disclaimer.svelte'
    import DetailsTopCard from '../../components/details/top_card.svelte'
    import PersonMedia from '../../components/details/person_media.svelte'


    const PERSON_DETAIL_URL: string = `${variables.apiPath}/person/${$page.params.id}`;
    const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';
    const LOW_RES_IMG_URL: string = 'https://image.tmdb.org/t/p/w500/';
    const INITIAL_BIOGRAPHY_LENGTH: number = 500;
    const SHOW_BUTTON_AMOUNT: number = 12;
    const CAST_ITEM_START_AMOUNT: number = 6;

    let currentBiographyLength: number = INITIAL_BIOGRAPHY_LENGTH;
    let currentMovieAmount: number = 6;
    let currentTVAmount: number = 6;
    let personName: string = 'Loading...';

    const fetchPersonDetails = async () => {
		const response = await fetch(PERSON_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			personName = jsonResponse.name;
            removeContentWithMissingImagePath(jsonResponse.movie_credits, "poster_path");
            removeContentWithMissingImagePath(jsonResponse.tv_credits, "poster_path");

            removeDuplicates(jsonResponse.movie_credits);
            removeDuplicates(jsonResponse.tv_credits);

            sortListByPopularity(jsonResponse.movie_credits);
            sortListByPopularity(jsonResponse.tv_credits);

            return jsonResponse;
		} else {
			console.error(response.statusText);
			personName = 'Error loading person'
			throw new Error(response.statusText)
		}
    };

</script>

<svelte:head>
    <title>{personName} - Streamchaser</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar/>
    <div class="container mx-auto pb-2">
        {#await fetchPersonDetails()}
            <p>Loading...</p>
        {:then person}
            <DetailsTopCard
                backdropPath={person.movie_credits[0].backdrop_path}
                imgUrl={IMG_URL}
                posterPath={person.profile_path}
                title={person.name}
                overview={person.biography}
                overviewLength={currentBiographyLength}
                initialOverviewLength={INITIAL_BIOGRAPHY_LENGTH}
                genres={null}
                providers={null}
            />

            <PersonMedia
                imgUrl={LOW_RES_IMG_URL}
                media={person.movie_credits}
                mediaType={'movie'}
                title={'Movie'}
                mediaAmount={currentMovieAmount}
                showButtonAmount={SHOW_BUTTON_AMOUNT}
                itemStartAmount={CAST_ITEM_START_AMOUNT}
            />

            <PersonMedia
                imgUrl={LOW_RES_IMG_URL}
                media={person.tv_credits}
                mediaType={'tv'}
                title={'Series'}
                mediaAmount={currentTVAmount}
                showButtonAmount={SHOW_BUTTON_AMOUNT}
                itemStartAmount={CAST_ITEM_START_AMOUNT}
            />
        {:catch error}
            <Error error={error} />
        {/await}
    </div>
<Footer/>
</div>
<CookieDisclaimer />
