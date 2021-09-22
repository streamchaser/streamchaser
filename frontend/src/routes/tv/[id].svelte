<script>
    import { variables } from '../../variables.js'
    import {page} from '$app/stores';
    import {currentCountry} from '../../stores/country.js';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';


    const TV_DETAIL_URL = `${variables.apiPath}/tv/${$currentCountry}/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';

    const fetchTVDetails = async () => {
        try {
            const response = await fetch(TV_DETAIL_URL);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    let firstLoadCompleted = false;

    $: if ($currentCountry) {
        if (firstLoadCompleted) {
            location.reload();
        }
        firstLoadCompleted = true;
    }

    function routeToPage(mediaId) {
        goto(`/tv/${mediaId}`)
        location.reload()
    }

</script>

<Navbar/>

<div class="container mx-auto pb-2">
    {#await fetchTVDetails()}
        <p>Loading...</p>
    {:then tv}
        <div
                class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
                style="background-image: url(&quot;{IMG_URL}{tv.backdrop_path}&quot;);e"
        >
            <div class="card glass lg:card-side text-neutral-content">
                <figure class="p-6">
                    <img
                            src="{IMG_URL}{tv.poster_path}"
                            class="object-contain h-96 w-full rounded-lg"
                            alt="Poster path for tv series"
                    />
                </figure>
                <div class="max-w-md card-body">
                    <h2 class="card-title">{tv.name}</h2>
                    <p>{tv.overview}</p>
                    <div class="flex-nowrap pt-5">
                        <div class="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row">
                            {#each tv.genres as genre}
                                <div class="badge">{genre}</div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-nowrap pt-5">
                {#each tv.providers as provider}
                    <div class="avatar p-2">
                        <div class="mb-8 w-24 h-24 mask mask-squircle">
                            <img src="{IMG_URL}{provider.logo_path}" alt="Provider logo"/>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        {#if tv.recommendations.length != 0}
            <h1 class="text-center text-3xl pt-5">Recommendations</h1>
            <div class="pt-5">
                <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
                {#each tv.recommendations as recommendation}
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

<Footer/>
