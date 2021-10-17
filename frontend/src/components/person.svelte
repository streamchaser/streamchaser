<script>
    import {goto} from '$app/navigation';

    export let imgUrl;
    export let media;
    export let showButtonAmount;
    export let castItemStartAmount;

    let castItemAmount = 9;

    function routeToPerson(mediaId) {
        goto(`/person/${mediaId}`)
        location.reload()
    }

</script>

{#if media.cast.length !== 0}
    <h1 class="text-center text-3xl pt-5">Cast</h1>
    <div class="grid grid-cols-3 2xl:grid-cols-9 xl:grid-cols-8 lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-4 gap-3 p-2 pt-4">
        {#each media.cast.slice(0, castItemAmount) as person}
            {#if person.profile_path}
                <div on:click={() => routeToPerson(person.id)}
                     class="card compact cursor-pointer bordered">
                    <figure>
                        <img src="{imgUrl}{person.profile_path}" alt="{person.name}">
                    </figure>
                    <div class="card-body">
                        <p><b>{person.name}</b> - <i>{person.character}</i></p>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
    <div class="flex space-x-1 justify-center">
        {#if castItemAmount < media.cast.length}
            <button
                    on:click={() => castItemAmount = castItemAmount + showButtonAmount}
                    type="button"
                    class="btn">
                Show more
            </button>
        {/if}
        {#if castItemAmount > castItemStartAmount}
            <button
                    on:click={() => castItemAmount = castItemAmount - showButtonAmount}
                    type="button"
                    class="btn">
                Show less
            </button>
        {/if}
    </div>
{/if}