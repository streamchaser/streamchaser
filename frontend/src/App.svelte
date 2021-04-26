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
    let media = [];

    // run search if we haven't received input in the last 200ms
    const debounceInput = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            search(input);
        }, INPUT_TIMER);
    }

    const search = async () => {
        const res = await fetch(url + input);
        media = await res.json();
    };
</script>

<MaterialApp>
    <h1>Placeholder</h1>
    <TextField dense rounded outlined autofocus
               bind:value={input}
               on:input={debounceInput}>
        Search
    </TextField>

    {#if media.hits}
        <div transition:fly="{{ y: 200, duration: 2000 }}" class="d-flex flex-wrap align-content-stretch justify-center mt-4 mb-4">
            {#each media.hits as media}
                <Card style="max-width:350px;">
                    <img src="https://image.tmdb.org/t/p/w500{media.poster_path}" alt="background"/>
                    <CardTitle>{media.title}</CardTitle>
                    <CardSubtitle>
                        {#each media.genres as genre}
                            {genre + ' '}
                        {/each}
                    </CardSubtitle>
                </Card>
            {/each}
        </div>
    {/if}
</MaterialApp>
