<script>
    import { params } from '@roxi/routify'
    import {MaterialApp, Card, CardText, Tabs, Tab, TabContent, Icon} from 'svelte-materialify'
    import {mdiRefresh} from '@mdi/js';
    import Footer from "../../components/Footer.svelte";
    import Header from "../../components/Header.svelte";
    import Carousel from '../../components/Carousel.svelte';

    const tv_detail_url = `http://localhost:1337/tv/${$params.cc}/${$params.id}`

    const fetchTvDetails = async () => {
        const response = await fetch(tv_detail_url);
        return await response.json()
    }

    const API_URL = "https://image.tmdb.org/t/p/original/"
</script>

<MaterialApp>
    <Header/>

    <div class="container">
        {#await fetchTvDetails()}
            <Icon spin path={mdiRefresh}/>
        {:then tv}
            <div class="poster-stack">
                <div class="card">
                    <img src="{API_URL}{tv.backdrop_path}" style="position: absolute; filter:
                    blur(8px); max-height: 100%;" alt="backdrop poster"/>
                    <img src="{API_URL}{tv.poster_path}"
                         alt="background" style="max-width: 30em; position: relative;
                             z-index: 1"/>
                    <div class="card-info">
                        <div class="d-flex justify-center mt-4 mb-4">
                            <Card outlined shaped style="background-color: #212121;
                                                         box-shadow: 0 0 5px 10px #212121;
                                                         color: white;">
                                <div class="pl-4 pr-4 pt-3">
                                    <br/>
                                    <span class="text-h5 mb-2">{tv.name}</span>
                                    <br/>
                                </div>
                                <CardText style="color: white;">
                                    <h6>{tv.first_air_date}</h6>
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
                        &nbsp
                    {/each}
                </div>
            </div>
            <div style="padding-top: 2vh;">
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
                                <div style="display: flex;">
                                    <img src="{API_URL}{season.poster_path}"
                                         alt="season-content" style="max-height: 45vh"/>
                                    <div style="margin-left: 1vw;
                                    min-width: 5vw; max-height: 5vh;">
                                        <h5>{season.air_date ? season.air_date.split('-')[0] : "No air date"}
                                            | {season.episode_count} episodes
                                        </h5>
                                        &nbsp
                                        <h5>{season.air_date ?
                                            `Premiered on ${season.air_date}` : "Hasn't aired"}
                                        </h5>
                                        &nbsp
                                        <p>{season.overview ? season.overview : "No season overview"}</p>
                                    </div>
                                </div>
                            </TabContent>
                        {/each}
                    </div>
                </Tabs>
            </div>

            <div style="padding-top: 3vh; padding-bottom: 8vh;">
                <h6>Recommendations</h6>
                <Carousel recommendations="{tv.recommendations}"/>
            </div>

        {:catch error}
            <p>Tv details error: {error}</p>
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
        position: relative;
    }

    .card {
        margin: auto;
        padding-top: 1vw;
        width: 50vw;
        display: flex;
        position: relative;
        min-width: 500px;
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