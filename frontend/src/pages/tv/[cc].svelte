<script>
    import {goto, params, url} from '@roxi/routify'
    import { MaterialApp, Card, CardText, Tabs, Tab, TabContent, Icon, CardTitle } from 'svelte-materialify'
    import { mdiRefresh } from '@mdi/js';
    import Header from "../../components/Header.svelte";
    import Carousel from '../../components/Carousel.svelte';
    import { currentCountry } from "../../store";


    const tv_detail_url = `http://localhost:1337/tv/${$params.cc}/${$params.id}`

    let firstLoadCompleted = false

    const fetchTvDetails = async () => {
        const response = await fetch(tv_detail_url);
        return await response.json()
    }

    const API_URL = "https://image.tmdb.org/t/p/original/"

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
    {#await fetchTvDetails()}
        <Icon spin path={mdiRefresh}/>
    {:then tv}
        <img class="backdrop-img" src="{API_URL}{tv.backdrop_path}"/>
        <div class="container">
            <div class="poster-stack">
                <div class="card">
                    <img src="{API_URL}{tv.poster_path}"
                         alt="background" style="max-width: 50%; position: relative; border-radius: 5% 2% 5% 2%;
                             z-index: 1; box-shadow: 0 0 3px black"/>
                    <div class="card-info">
                        <div class="d-flex justify-center mt-4 mb-4">
                            <Card outlined shaped style="background: black; opacity: 75%;">
                                <CardTitle style="color: white">
                                    <h5>{tv.name}</h5>
                                </CardTitle>
                                <CardText style="color: white;">
                                    <h6>{tv.first_air_date}</h6>
                                    &nbsp
                                    <p>{tv.overview}</p>
                                </CardText>
                            </Card>
                        </div>

                    </div>
                </div>

                <div class="providers">
                    {#each tv.providers as provider}
                        <img class="provider-logo"
                             src="{API_URL}{provider.logo_path}"
                             alt="cover"/>
                    {/each}
                </div>
            </div>
            <div style="padding-top: 2vh;">
                &nbsp
                <h4>Seasons</h4>
                &nbsp
                <Tabs centerActive>
                    <div slot="tabs" style="min-width: 75vw;">
                        {#each tv.seasons as season}
                            <Tab>{season.name}</Tab>
                        {/each}
                    </div>
                    <div>
                        {#each tv.seasons as season}
                            <TabContent>
                                <br>
                                <div style="display: flex; margin-bottom: 1em; margin-left: 1em">
                                    <img src="{API_URL}{season.poster_path}"
                                         alt="season-content" style="max-height: 45vh; border-radius: 5% 2% 5% 2%;
                                            box-shadow: 0 0 3px black"/>
                                    <div style="margin-left: 1vw; min-width: 5vw; max-height: 5vh;">
                                        <h5>{season.air_date ? season.air_date.split('-')[0] : "No air date"}
                                            | {season.episode_count} episodes
                                        </h5>
                                        &nbsp
                                        <h5>{season.air_date ?
                                            `Premiered on ${season.air_date}` : "Hasn't aired"}
                                        </h5>
                                        &nbsp
                                        <p>{season.overview ? season.overview : "No season overview available."}</p>
                                    </div>
                                </div>
                            </TabContent>
                        {/each}
                    </div>
                </Tabs>
            </div>

            <div style="padding-top: 3vh; padding-bottom: 8vh;">
                &nbsp&nbsp
                <h4>Recommendations</h4>
                &nbsp
                <Carousel recommendations="{tv.recommendations}"/>
            </div>
        </div>
    {:catch error}
        <p>Tv details error: {error}</p>
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
        width: 50%;
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