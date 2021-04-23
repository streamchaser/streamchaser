<script>
    import { fly } from 'svelte/transition';

    const url = 'http://localhost:1337/search/';
    let input = '';
    let movies = [];

    const search = async () => {
        const res = await fetch(url + input);
        movies = await res.json();
    };
</script>

<main>
    <h1>Placeholder</h1>

    <input bind:value={input} on:input={search}>

    {#if movies.hits}
        <table>
            <tr>
                <th transition:fly>ID</th>
                <th transition:fly>Title</th>
                <th transition:fly>Release Date</th>
                <th transition:fly>Genres</th>
            </tr>
            {#each movies.hits as movie}
                <tr>
                    <td transition:fly>{movie.id}</td>
                    <td transition:fly>{movie.title}</td>
                    <td transition:fly>{movie.release_date}</td>
                    <td transition:fly>{movie.genres}</td>
                </tr>
            {/each}
        </table>
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    table {
        width: 60%;
        margin-left: auto;
        margin-right: auto;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
