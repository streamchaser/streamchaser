<script>
    import { params } from '@roxi/routify'
    import {MaterialApp, Icon, Card, CardText} from 'svelte-materialify'
    import {mdiRefresh} from '@mdi/js'
    import Footer from "../../components/Footer.svelte";
    import Header from "../../components/Header.svelte";
    import Carousel from '../../components/Carousel.svelte';

    const movie_detail_url = `http://localhost:1337/movie/${$params.cc}/${$params.id}`

    const fetchMovieDetails = async () => {
        const response = await fetch(movie_detail_url);
        return await response.json()
    }

    const API_URL = "https://image.tmdb.org/t/p/original/"
</script>

<MaterialApp>
    <Header/>

    <div class="container">
        {#await fetchMovieDetails()}
            <Icon spin path={mdiRefresh}/>
        {:then movie}
            <div class="poster-stack">
                <div class="card">
                    <img src="{API_URL}{movie.backdrop_path}" style="position: absolute; filter:
                    blur(8px); max-height: 100%;" alt="backdrop poster"/>
                    <img src="{API_URL}{movie.poster_path}"
                         alt="background" style="max-width: 30em; position: relative"/>
                    <div class="card-info">
                        <div class="d-flex justify-center mt-4 mb-4">
                            <Card outlined shaped style="background-color: #212121;
                                                         box-shadow: 0 0 5px 10px #212121;
                                                         color: white;">
                                <div class="pl-4 pr-4 pt-3">
                                    <br/>
                                    <span class="text-h5 mb-2">{movie.title}</span>
                                    <br/>
                                </div>
                                <CardText style="color: white;">
                                    <h6>{movie.release_date}</h6>
                                    <h6>{movie.rating ? movie.rating : 'No rating'}</h6>
                                    <p>{movie.overview}</p>
                                </CardText>
                            </Card>
                        </div>

                    </div>
                </div>


                <div class="providers">
                    {#each movie.providers as provider}
                        <img class="provider-logo" src="{API_URL}{provider.logo_path}"
                             alt="cover"/>
                    {/each}
                </div>
            </div>

            <div style="padding-top: 3vh; padding-bottom: 8vh;">
                <h6>Recommendations</h6>
                <Carousel recommendations="{movie.recommendations}"/>
            </div>

        {/await}
    </div>

    <Footer/>

</MaterialApp>

<style>
    div.container {
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
        margin: auto;
        padding-top: 1vw;
        width: 50vw;
        display: flex;
        position: relative;
        z-index: 3;
    }

    .card-info {
        margin-left: 1vw;
        display: block;
        justify-content: space-between;
        z-index: 1;
        height: 50vh;
    }

    .provider-logo {
        padding-top: 0.5vh;
        width: 3em;
        height: auto;
        z-index: 1;
    }


    .providers {
        display: flex;
        flex-direction: row;
        gap: 0.35vw;
        min-width: 40px;
        position: relative;
        z-index: 3;
    }
</style>