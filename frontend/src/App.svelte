<script>
    import {fly} from 'svelte/transition';
    import {
        MaterialApp,
        TextField,
        Card,
    } from 'svelte-materialify';
    import Footer from './components/Footer.svelte'

    const url = 'http://localhost:1337/search/';
    const INPUT_TIMER = 200;
    let input = '';
    let timer;
    let media = [];

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            input.trim() ? search() : media = [];
        }, INPUT_TIMER);
    }

    const search = async () => {
        const res = await fetch(url + input);
        media = await res.json();
    };
</script>

<MaterialApp>
    <div>
    <h1>Placeholder</h1>
    <TextField dense rounded outlined autofocus
               bind:value={input}
               on:input={debounceInput}>
        Search
    </TextField>


    {#if media.hits}
        <div transition:fly="{{ y: 200, duration: 200 }}"
             class="d-flex flex-wrap align-content-start mt-4 mb-4 flex-grow-0 flex-shrink-0">
            {#each media.hits as media}
                <div class="media-item">
                    <Card style="height: 100%">
                        <img src="https://image.tmdb.org/t/p/w500{media.poster_path}" alt="background"/>
                    </Card>
                </div>
            {/each}
        </div>
    {/if}
    </div>
    <Footer />
</MaterialApp>

<style>
    img {
        max-width: 100%;
        max-height: 100%;
    }
    .media-item {
        width: calc(14.27% - 20px);
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
    }
</style>

