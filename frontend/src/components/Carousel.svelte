<script>
    import {Icon} from 'svelte-materialify'
    import Carousel from "@beyonk/svelte-carousel";
    import {mdiArrowRightBoldCircle , mdiArrowLeftBoldCircle } from '@mdi/js'
    import {goto, url} from '@roxi/routify'
    import { currentCountry } from '../store.js';


    const API_URL = "https://image.tmdb.org/t/p/original/"

    export let recommendations;

    const delta = 6;
    let startX;
    let startY;

    function mouseDownTracker(event) {
        startX = event.pageX;
        startY = event.pageY;
    }

    function mouseUpDragOrRedirecter(event, id) {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);

        if (diffX < delta && diffY < delta) {
            $goto('./:cc', {cc: $currentCountry, id: id})
        }
    }

</script>

<main>
    <Carousel perPage={4} dots={false}>
        <span class="control" slot="left-control">
            <Icon path={mdiArrowLeftBoldCircle} size={50}/>
        </span>
        {#each recommendations as recommendation}
            <div class="carousel-content">
                <img src="{API_URL}{recommendation.poster_path}"
                     on:mousedown={mouseDownTracker}
                     on:mouseup={mouseUpDragOrRedirecter(event, recommendation.id)}
                     alt="recommended content"
                    style="border-radius: 5% 2% 5% 2%; box-shadow: 0 0 3px black"/>
            </div>
        {/each}
        <span class="control" slot="right-control">
            <Icon path={mdiArrowRightBoldCircle} size={50}/>
        </span>
    </Carousel>
</main>

<style>
    .carousel-content {
        display: flex;
        height: 34vh;
        z-index: 1;
        border: 3px solid #fff;

    }


</style>
