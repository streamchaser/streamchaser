<script>
    import MediaQuery from 'svelte-media-query'

    export let seasons;
    let currentTab = 0;

    const LOW_RES_IMG_URL = 'https://image.tmdb.org/t/p/w500/';

    const changeActiveTab = (index) => {
        currentTab = index;
    }
</script>

<div class="container px-2">
    <div class="text-3xl p-4 flex justify-center">Seasons</div>
    <div class="tabs md:flex sm:justify-center m-mx">
        {#each seasons as season, index}
            {#if index === currentTab}
                <div class="tab tab-bordered tab-lg tab-active">{season.name === 'Specials' ? 'S' : season.name.substr(season.name.indexOf(' ') + 1)}
                </div>
            {:else}
                <div on:click={() => changeActiveTab(index)}
                     class="tab tab-lg tab-bordered">{season.name === 'Specials' ? 'S' : season.name.substr(season.name.indexOf(' ') + 1)}</div>
            {/if}
        {/each}
    </div>

    <div class="my-4 flex justify-center">
        {#each seasons as season, index}
            <MediaQuery query="(max-width: 1024px)" let:matches>
                {#if matches}
                    {#if index === currentTab}
                        <div class="card shadow-lg image-full w-auto sm:w-4/6 md:w-3/5 ">
                            {#if season.poster_path}
                                <figure>
                                    <img src="{LOW_RES_IMG_URL}{season.poster_path}"
                                         class="object-fit rounded-lg"
                                         alt="Poster for season">
                                </figure>
                            {:else}
                                <figure>
                                    <img src="../static/no_image_available.jpg"
                                         class="object-fit rounded-lg"
                                         alt="No poster available">
                                </figure>
                            {/if}
                            <div class="card-body">
                                <div class="card-title">{season.name}</div>
                                <div class="text-xl">{season.air_date ? season.air_date.split('-')[0] : "No air date"}
                                    | {season.episode_count} episodes
                                </div>
                                <div class="text-lg">{season.air_date ?
                                    `Premiered on ${season.air_date}` : "Hasn't aired"}
                                </div>
                                &nbsp
                                <div class="text-base">{season.overview ? season.overview : "No season overview available."}</div>
                            </div>
                        </div>
                    {/if}
                {/if}
            </MediaQuery>
            <MediaQuery query="(min-width: 1025px)" let:matches>
                {#if matches}
                    {#if index === currentTab}
                        <div class="card card-side bordered lg:w-5/6 xl:w-3/5">
                            {#if season.poster_path}
                                <figure>
                                    <img src="{LOW_RES_IMG_URL}{season.poster_path}"
                                         class="object-fit rounded-lg h-96"
                                         alt="Poster for season">
                                </figure>
                            {:else}
                                <figure>
                                    <img src="../static/no_image_available.jpg"
                                         class="object-fit rounded-lg h-86"
                                         alt="No poster available">
                                </figure>
                            {/if}
                            <div class="mx-4 my-2">
                                <div class="text-xl">{season.air_date ? season.air_date.split('-')[0] : "No air date"}
                                    | {season.episode_count} episodes
                                </div>
                                &nbsp
                                <div class="text-lg">{season.air_date ?
                                    `Premiered on ${season.air_date}` : "Hasn't aired"}
                                </div>
                                &nbsp
                                <div class="text-sm">{season.overview ? season.overview : "No season overview available."}</div>
                            </div>
                        </div>
                    {/if}
                {/if}
            </MediaQuery>
        {/each}
    </div>
</div>
