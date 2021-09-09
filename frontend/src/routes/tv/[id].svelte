<script>
    import { variables } from '../../../variables.js'
    import {page} from '$app/stores';
    import {currentCountry} from '../../stores/country.js';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';

<<<<<<< HEAD:frontend/src/routes/tv/[id].svelte
    const tvDetailUrl = `http://localhost:1337/tv/${$currentCountry}/${$page.params.id}`;
=======
    const tvDetailUrl = `${variables.ap}/tv/${$page.params.cc}/${$page.params.id}`;
>>>>>>> Implment Traefik and improve deployment "flow":frontend/src/routes/tv/[cc]/[id].svelte
    const imgUrl = 'https://image.tmdb.org/t/p/original/';

    const fetchTVDetails = async () => {
        try {
            const response = await fetch(tvDetailUrl);
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

</script>

<Navbar/>

<div class="container mx-auto">
    {#await fetchTVDetails()}
        <p>Loading...</p>
    {:then tv}
        <div
                class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
                style="background-image: url(&quot;{imgUrl}{tv.backdrop_path}&quot;);e"
        >
            <div class="card glass lg:card-side text-neutral-content">
                <figure class="p-6">
                    <img
                            src="{imgUrl}{tv.poster_path}"
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
                            <img src="{imgUrl}{provider.logo_path}" alt="Provider logo"/>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="table w-full">
                <thead>
                <tr>
                    <th/>
                    <th>Title</th>
                    <th>Language</th>
                    <th>First Air Date</th>
                </tr>
                </thead>
                <tbody>
                {#each tv.recommendations as recommendation, i}
                    <tr>
                        <th {i}/>
                        <th>{recommendation.name}</th>
                        <th>{recommendation.original_language}</th>
                        <th>{recommendation.first_air_date ? recommendation.first_air_date : 'No air date available'}</th>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {/await}
</div>

<Footer/>