<script>
    import {Icon} from 'svelte-materialify'
    import Carousel from "@beyonk/svelte-carousel";
    import {mdiArrowLeft, mdiArrowRight} from '@mdi/js'

    const API_URL = "https://image.tmdb.org/t/p/original/"

    export let recommendations;
</script>

<main>
    <Carousel perPage={4} dots={false}>
        <span class="control" slot="left-control">
            <Icon path={mdiArrowLeft} style="color: white;"/>
        </span>
        {#each recommendations as recommendation}
            <div class="carousel-content">
                <img src="{API_URL}{recommendation.poster_path}"
                     alt="recommended content"/>
            </div>
        {/each}
        <span class="control" slot="right-control">
            <Icon path={mdiArrowRight} style="color: white;"/>
        </span>
    </Carousel>
</main>

<style>

    .carousel-content {
        display: flex;
        transform: scale(1.18, 1);
        margin-left: 1.3vw;
        height: 30vh;
        z-index: 1;
    }
</style>