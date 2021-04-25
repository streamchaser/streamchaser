<script>
    import {fly} from 'svelte/transition';
    import {
        MaterialApp,
        TextField,
        Card,
        CardTitle,
        CardSubtitle
    } from 'svelte-materialify';

    const url = 'http://localhost:1337/search/';
    const INPUT_TIMER = 200;
    let input = '';
    let timer;
    let movies = [];

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            search(input);
        }, INPUT_TIMER);
    }

    const search = async () => {
        const res = await fetch(url + input);
        movies = await res.json();
    };
</script>

<MaterialApp>
    <h1>Placeholder</h1>
    <TextField dense rounded outlined autofocus
               bind:value={input}
               on:input={debounceInput}>
        Search
    </TextField>

    {#if movies.hits}
        <div transition:fly="{{ y: 200, duration: 2000 }}" class="d-flex flex-wrap align-content-stretch justify-center mt-4 mb-4">
            {#each movies.hits as movie}
                <Card style="max-width:350px;">
                    <img src="//picsum.photos/350" alt="background"/>
                    <CardTitle>{movie.title}</CardTitle>
                    <CardSubtitle>{movie.genres}</CardSubtitle>
                </Card>
            {/each}
        </div>
    {/if}
</MaterialApp>
