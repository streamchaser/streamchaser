<script>
    import { variables } from '../../variables.js'
    import {page} from '$app/stores';
    import Navbar from '../../components/navbar.svelte';
    import Footer from '../../components/footer.svelte';
    import {goto} from '$app/navigation';

    const PERSON_DETAIL_URL = `${variables.apiPath}/person/${$page.params.id}`;
    const IMG_URL = 'https://image.tmdb.org/t/p/original/';

    const fetchPersonDetails = async () => {
        try {
            const response = await fetch(PERSON_DETAIL_URL);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    function routeToPage(mediaId, mediaType) {
        goto(`/${mediaType}/${mediaId}`)
        location.reload()
    }


</script>

<Navbar/>

<div class="container mx-auto pb-2">
    {#await fetchPersonDetails()}
        <p>Loading...</p>
    {:then person}
        <div class="card glass lg:card-side text-neutral-content">
            <figure class="p-6">
                <img
                        src="{IMG_URL}{person.profile_path}"
                        class="object-contain h-96 w-full rounded-lg"
                        alt="Poster path for tv series"
                />
            </figure>
            <div class="max-w-md card-body">
                <h2 class="card-title">{person.name}</h2>
                <p>{person.biography}</p>
            </div>
        </div>
        {#if person.movie_credits.length != 0}
            <h1 class="text-center text-3xl pt-5">Movies</h1>
            <div class="pt-5">
                <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
                {#each person.movie_credits as movies}
                    <div on:click={() => routeToPage(movies.id, 'movie')} class="carousel-item h-96 w-64 p-1">
                        <img src="{IMG_URL}{movies.poster_path}" class="rounded-lg cursor-pointer" 
                             alt="{movies.title}">
                    </div>
                {/each}
            </div>
        </div>
        {/if}   
        {#if person.tv_credits.length != 0}
        <h1 class="text-center text-3xl pt-5">TV Shows</h1>
        <div class="pt-5">
            <div class="p-4 space-x-4 carousel carousel-center bg-neutral sm:rounded-box">
            {#each person.tv_credits as tv}
                <div on:click={() => routeToPage(tv.id, 'tv')} class="carousel-item h-96 w-64 p-1">
                    <img src="{IMG_URL}{tv.poster_path}" class="rounded-lg cursor-pointer" 
                         alt="{tv.title}">
                    </div>
                {/each}
            </div>
        </div>
        {/if}
    {/await}
</div>

<Footer/>
