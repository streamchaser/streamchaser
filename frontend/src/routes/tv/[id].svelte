<script>
    import {variables} from '../../variables.js'
    import {page} from '$app/stores';
    import {currentCountry} from '../../stores/country.js';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';
    import Seasons from '../../components/seasons.svelte';
    import Error from '../../components/error.svelte';
    import Person from '../../components/person.svelte';


    const TV_DETAIL_URL = `${variables.apiPath}/tv/${$currentCountry}/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';
    const LOW_RES_IMG_URL = 'https://image.tmdb.org/t/p/w500/';
	const SHOW_BUTTON_AMOUNT = 18;
	const CAST_ITEM_START_AMOUNT = 9;

    let tvTitle = 'Loading...';

    const fetchTVDetails = async () => {
		const response = await fetch(TV_DETAIL_URL);

		if (response.status == 200) {
            let jsonResponse = await response.json();
			tvTitle = jsonResponse.name;

            removePersonWithMissingProfilePath(jsonResponse.cast);
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

    const removePersonWithMissingProfilePath = (list) => {
        for (let i = 0; i < list.length; i++) {
            if (!list[i].profile_path) {
                list.splice(i, 1);
                i--;
            }
        }
        return list
    }

    const sortListByPopularity = (list) => {
        return list.sort((a, b) =>
            b.popularity - a.popularity
        );
    }

    function routeToPage(mediaId) {
        goto(`/tv/${mediaId}`)
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
                            alt="{tv.name}"
                        />
                    </figure>
                    <div class="max-w-md card-body">
                        <h2 class="card-title">{tv.name}</h2>
                        <p>{tv.overview}</p>
                        <div class="flex-wrap mt-2">
                            {#each tv.genres as genre}
                                <div class="badge mx-2">{genre}</div>
                            {/each}
                        </div>
                    </div>
                </div>
                <!-- Provider -->
                <div class="flex-nowrap pt-5">
                    {#each tv.providers as provider}
                        <div class="avatar p-2">
                            <div class="mb-8 w-24 h-24 mask mask-squircle">
                                <img src="{IMG_URL}{provider.logo_path}" alt="{provider.provider_name}"/>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <Seasons seasons={tv.seasons} />

            <Person media={tv} imgUrl={LOW_RES_IMG_URL} showButtonAmount={SHOW_BUTTON_AMOUNT} castItemStartAmount={CAST_ITEM_START_AMOUNT} />

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
