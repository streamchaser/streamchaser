<script>
    import {fly} from 'svelte/transition';
    import {
        MaterialApp,
        TextField,
        Card
    } from 'svelte-materialify';
    import Select from 'svelte-select'
    import Header from './components/Header.svelte'
    import Footer from './components/Footer.svelte'

    const search_url = 'http://localhost:1337/search/';
    const genre_url = 'http://localhost:1337/genres/';
    const INPUT_TIMER = 200;
    let input = '';
    let timer;
    let active = true;
    let media = [];
    let selectedValue;

    const fetchGenres = async () => {
        const res = await fetch(genre_url);
        return await res.json()
    }

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, INPUT_TIMER);
    }

    $: selectedGenreValues = selectedValue ? selectedValue.map(item => item.value) : [];

    const search = async () => {
        // Builds the optional query for genres
        // Example: "?g=Action&g=Comedy&g=Drama"
        let genre_query = '';
        for(let i = 0; i < selectedGenreValues.length; i++){
            // First query needs a "?"
            if(i === 0){
                genre_query += `?g=${selectedGenreValues[0]}`;
            } else {
                genre_query += `&g=${selectedGenreValues[i]}`;
            }
        }
        const res = await fetch(search_url + input + genre_query);
        media = await res.json();
    };
</script>

<MaterialApp>


    <Header />
    <div class="container">
    <h1 style="text-align: center">Placeholder</h1>

        <div class="input">
            <TextField dense rounded outlined autofocus
               bind:value={input}
               on:input={debounceInput}>
            Search
            </TextField>
        </div>

        <div class="select">
            {#await fetchGenres()}
                <p>...loading selection</p>
            {:then genres}
                <Select items={genres}
                        isMulti={true}
                        bind:selectedValue
                        on:select={debounceInput}>
                </Select>
            {:catch error}
                <p>Select error! {error}</p>
            {/await}
        </div>


    {#if media.hits}
        <div transition:fly="{{ y: 200, duration: 200 }}"
             class="d-flex flex-wrap align-content-start mt-4 mb-4 flex-grow-0 flex-shrink-0">
            {#each media.hits as media, index}
                <div class="media-item">
                    <Card flat>
                        <img src="https://image.tmdb.org/t/p/w500{media.poster_path}" alt="background"/>
                        {index}
                        {media.genres}
                        {media.id}
                    </Card>
                </div>
            {/each}
        </div>
    {/if}
    </div>
    <div>
        <Footer />
    </div>
</MaterialApp>

<style>
    div.container {
        padding-bottom: 3.7%;
        margin-left: 10px;
        margin-right: 10px;
    }

    div.input {
        width: 50%;
        margin-top: 50px;
        margin-left: auto;
        margin-right: auto;
    }

    img {
        max-width: 100%;
        max-height: 100%;
    }
    div.select {
        max-width: calc(50% - 20px);
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 20px;
    }
    .media-item {
        width: calc(14.27% - 20px);
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
        height: 100%;
    }
</style>

