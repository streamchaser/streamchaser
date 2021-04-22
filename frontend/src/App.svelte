<script>
    import { MeiliSearch } from 'meilisearch'

    const client = new MeiliSearch({
        host: 'http://search:7700',
        apiKey: 'masterKey',
    })

    const index = client.index('movies')

    let input = ''


    const search = () => {
        alert(index.search(input))
    };
</script>


<main>
    <div id="data_table"></div>

    <h1>Input {input}!</h1>

    <input bind:value={input}>

    <button on:click={ search }>Search</button>
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

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
