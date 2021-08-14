<script>
    import {url, params, goto} from '@roxi/routify'
    import { MaterialApp, Icon, Card, CardText, CardTitle } from 'svelte-materialify'
    import { mdiRefresh } from '@mdi/js'
    import Header from "../../components/Header.svelte";
    import Carousel from '../../components/Carousel.svelte';
    import { currentCountry } from '../../store.js';

    const movie_detail_url = `http://localhost:1337/movie/${$params.cc}/${$params.id}`

    const fetchMovieDetails = async () => {
        const response = await fetch(movie_detail_url);
        return await response.json()
    }

    const API_URL = "https://image.tmdb.org/t/p/original/"

    let firstLoadCompleted = false
    // If the variable changes
    $: if($currentCountry) {
        if (firstLoadCompleted === true) {
            window.location.href = $url('./:cc', {cc: $currentCountry, id: $params.id})
        }
        firstLoadCompleted = true;
    }

</script>

<MaterialApp>
    <Header/>
    {#await fetchMovieDetails()}
        <Icon spin path={mdiRefresh}/>
    {:then movie}
        <img class="backdrop-img" src="{API_URL}{movie.backdrop_path}"/>
        <div class="container">
            <div class="poster-stack">
                <div class="card">
                    <img src="{API_URL}{movie.poster_path}"
                         alt="background" style="max-width: 50%; position: relative; border-radius: 5% 2% 5% 2%;
                                box-shadow: 0 0 3px black"/>
                    <div class="card-info">
                        <div class="d-flex justify-center mt-4 mb-4">
                            <Card outlined shaped style="background: black; opacity: 75%;">
                                <CardTitle style="color: white">
                                    <h5>{movie.title}</h5>
                                </CardTitle>
                                <CardText style="color: white;">
                                    <h6>{movie.release_date}</h6>
                                    &nbsp
                                    <!--
                                    <h6>{movie.rating ? movie.rating : 'No rating'}</h6>
                                    -->
                                    <p>{movie.overview}</p>
                                </CardText>
                            </Card>
                        </div>
                    </div>
                </div>
                <div class="providers">
                    {#each movie.providers as provider}
                        <img class="provider-logo" src="{API_URL}{provider.logo_path}" alt="cover"/>
                    {/each}
                </div>
            </div>

            <div style="padding-top: 3vh; padding-bottom: 8vh;">
                &nbsp
                <h4>Recommendations</h4>
                &nbsp
                <Carousel recommendations="{movie.recommendations}"/>
            </div>
        </div>
    {/await}
</MaterialApp>

<style>
    img.backdrop-img {
        padding-top: 3em;
        filter: blur(4px);
        background-repeat: no-repeat;
        width: 80%;
        position: absolute;
        left: 10%;
        max-height: 84%;
    }

    div.container {
        padding-top: 3em;
        display: block;
        width: 50vw;
        margin: auto;
    }

    .poster-stack {
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }

    .card {
        padding-top: 1vw;
        display: flex;
        position: relative;
        z-index: 3;
    }

    .card-info {
        margin-left: 1vw;
        padding-left: 1.5vw;
        display: block;
        justify-content: space-between;
        z-index: 1;
    }

    .provider-logo {
        border-radius: 15% 8% 15% 8%;
        width: 4em;
        z-index: 1;
        box-shadow: 0 0 3px black;
    }


    .providers {
        display: flex;
        flex-direction: row;
        gap: 0.35vw;
        min-width: 40px;
        position: relative;
        z-index: 3;
        padding-top: 1em;
    }
</style>