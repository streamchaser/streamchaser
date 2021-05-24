<script>
    import {fly, slide} from 'svelte/transition';
    import {
        MaterialApp,
        TextField,
        Card,
        CardText,
        CardActions,
        Button,
        Icon,
        Row,
        Col
    } from 'svelte-materialify';
    import Select from 'svelte-select'
    import Header from '../components/Header.svelte'
    import Footer from '../components/Footer.svelte'
    import {mdiChevronDown} from '@mdi/js'
    import {goto, url} from "@roxi/routify";

    const search_url = 'http://localhost:1337/search/';
    const genre_url = 'http://localhost:1337/genres/';
    const PROVIDER_URL = 'http://localhost:1337/providers/';
    const INPUT_TIMER = 200;
    let input = '';
    let timer;
    let active = false;
    let media = [];

    let showExtra = false;
    let currentCard;
    let hoverTimer;
    let selectedGenres;
    let selectedProviders;
    let bgImg;

    const fetchGenres = async () => {
        const res = await fetch(genre_url);
        return await res.json()
    }

    const fetchProviders = async () => {
        const res = await fetch(PROVIDER_URL);
        return await res.json()
    }

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, INPUT_TIMER);
    }

    $: mappedSelectedGenres = selectedGenres ? selectedGenres.map(item => item.value) : [];
    $: mappedSelectedProviders = selectedProviders ? selectedProviders.map(item => item.value) : [];

    const search = async () => {
        // Builds the optional query for genres
        // Example: "?g=Action&g=Comedy&g=Drama"
        let genre_query = '';
        for (let i = 0; i < mappedSelectedGenres.length; i++) {
            // First query needs a "?"
            if (genre_query.length === 0 && i === 0) {
                genre_query += `?g=${mappedSelectedGenres[0]}`;
            } else {
                genre_query += `&g=${mappedSelectedGenres[i]}`;
            }
        }
        for (let i = 0; i < mappedSelectedProviders.length; i++) {
            if (genre_query.length === 0 && i === 0) {
                genre_query += `?p=${mappedSelectedProviders[0]}`;
            } else {
                genre_query += `&p=${mappedSelectedProviders[i]}`;
            }
        }

        const res = await fetch(search_url + input + genre_query);
        media = await res.json();
    };

    function mouseEnter(index) {
        // Sets currentCard to the card currently being hovered over,
        // and enables expansion of card with extra content
        currentCard = index;
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!showExtra) {
                showExtra = true;
            }
        }, 200);
    }

    function mouseLeave() {
        if (showExtra) {
            showExtra = false;
        }
        currentCard = null;
        if (active) {
            active = false;
        }
    }

    function toggleOverview() {
        active = !active;
    }

    function redirectTo(id) {
        if (id[0] === 't') {
            $goto('./tv/:cc', {cc: 'dk', id: id.slice(1)})
        } else {
            $goto('./movie/:cc', {cc: 'dk', id: id.slice(1)})
        }
    }
</script>

<MaterialApp>

    <Header/>

    <div class="container">
        <h1 style="text-align: center">Placeholder</h1>
        <div class="input">
            <TextField dense rounded outlined autofocus
                       bind:value={input}
                       on:input={debounceInput}>
                Search
            </TextField>
        </div>

        <Row>
            <Col>
                {#await fetchGenres()}
                    <p>...loading selection</p>
                {:then genres}
                    <Select items={genres}
                            placeholder="Select genres..."
                            isMulti={true}
                            bind:selectedValue={selectedGenres}
                            on:select={debounceInput}>
                    </Select>
                {:catch error}
                    <p>Select error! {error}</p>
                {/await}
            </Col>

            <Col>
                {#await fetchProviders()}
                    <p>...loading selection</p>
                {:then providers}
                    <Select items={providers}
                            placeholder="Select providers..."
                            isMulti={true}
                            bind:selectedValue={selectedProviders}
                            on:select={debounceInput}>
                    </Select>
                {:catch error}
                    <p>Select error! {error}</p>
                {/await}
            </Col>
        </Row>

        {#if media.hits}
            <div transition:fly="{{ y: 200, duration: 200 }}"
                 class="d-flex flex-wrap align-content-start mt-4 mb-4 flex-grow-0 flex-shrink-0">
                {#each media.hits as media, index}
                    <div class="media-item" class:card={showExtra}
                         style="transition: all 150ms linear;"
                         on:mouseenter={() => mouseEnter(index)}
                         on:mouseleave={mouseLeave}>
                        {#if showExtra && index === currentCard}
                            <div style="position: absolute;">
                                <Card flat shaped hover>
                                    {#if active}
                                        <div transition:slide={{ y: 100, duration: 300 }}
                                             class="overview">
                                            <div class="pl-4 pr-4 pt-2 pb-2">
                                                <p style="line-height: 95%;">
                                                    <small>{media.overview}</small></p>
                                            </div>
                                        </div>
                                    {/if}
                                    <img on:click={ redirectTo(media.id) } src="https://image.tmdb.org/t/p/w500{media.poster_path}"
                                         alt="background"/>
                                    <div class="provider-nest">
                                        {#each media.specific_providers as provider}
                                            <img class="provider-logo-hover"
                                                 src="https://image.tmdb.org/t/p/w500{provider.logo_path}"
                                                 alt="Poster for {media.title}"
                                                 style="max-width: 50px;">
                                        {/each}
                                    </div>
                                    <p style="margin: 5px 10px 17px 10px; font-weight: bold">
                                        <small>
                                            {#each media.genres as genre, index}
                                                {genre}
                                                {#if index !== media.genres.length - 1}
                                                    •&nbsp
                                                {/if}
                                            {/each}
                                        </small>
                                    </p>
                                    <CardActions>
                                        <Button text on:click={toggleOverview}
                                                style="margin-top: -20px; z-index: 4">
                                            <Icon path={mdiChevronDown} rotate={active ? 180 : 0}/>
                                        </Button>
                                    </CardActions>
                                </Card>
                            </div>
                        {:else}
                            <Card flat shaped>
                                <img src="https://image.tmdb.org/t/p/w500{media.poster_path}"
                                     alt="background"/>
                                <div class="provider-nest">
                                    {#each media.specific_providers as provider}
                                        <img class="provider-logo"
                                             src="https://image.tmdb.org/t/p/w500{provider.logo_path}"
                                             alt="Poster for {media.title}"
                                             style="max-width: 50px">
                                    {/each}
                                </div>
                            </Card>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    </div>

    <Footer/>

</MaterialApp>

<style>
    div.container {
        padding-bottom: 3.7%;
        margin-left: 50px;
        margin-right: 50px;
    }

    div.input {
        width: 65%;
        margin-top: 5em;
        margin-left: auto;
        margin-right: auto;
    }

    img {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0 0 1.25% 0;
    }

    .media-item {
        width: calc(14.27% - 20px);
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 30px;
        height: 100%;
    }

    .provider-nest {
        background-color: #fff;
        margin-top: -7px;

    }

    .card-item:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to top, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 1) 100%);
        z-index: 1;
    }

    .card:hover {
        transition: transform 300ms ease-in-out;
        transform: scale(1.2);
        z-index: 4;
    }

    .provider-logo {
        border-radius: 0 0 25% 25%;
        margin-bottom: -7px;
        margin-top: 1px;
        margin-right: 3px;
        width: 15%;
        height: 15%;
    }

    .provider-logo-hover {
        border-radius: 0 0 25% 25%;
        margin-bottom: -7px;
        margin-top: 1px;
        margin-right: 3px;
        margin-left: 0;
        width: 15%;
        height: 15%;
    }

    .provider-logo-hover:first-child {
        border-radius: 0 0 25% 0;
    }

    .overview {
        position: absolute;
        z-index: 6;
        bottom: 50px;
        background-color: white;
        border: solid ghostwhite thin
    }
</style>
