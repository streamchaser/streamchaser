<script lang="ts">
    import ReadMore from "./read_more.svelte";

    const INITIAL_OVERVIEW_LENGTH: number = 500;
    const IMG_URL: string = 'https://image.tmdb.org/t/p/original/';

    export let backdropPath: string
    export let posterPath: string
    export let title: string
    export let overview: string
    export let genres: []
    export let providers: []

    let currentOverviewLength: number = INITIAL_OVERVIEW_LENGTH;

</script>

<div
    class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
    style="background-image: url(&quot;{IMG_URL}{backdropPath}&quot;);e">
    <div class="card lg:card-side bg-gray-700 bg-opacity-90 bordered text-neutral-content">
        <figure class="p-6">
            <img
                src="{IMG_URL}{posterPath}"
                class="object-contain h-96 w-full rounded-lg"
                alt={title}
            />
        </figure>
        <div class="card-body max-w-md">
            <h2 class="card-title">{title}</h2>
            <ReadMore
                currentDescriptionLength={currentOverviewLength}
                mediaDescription={overview}
                initialDescriptionLength={INITIAL_OVERVIEW_LENGTH}
            />
            {#if genres}
                <div class="flex-wrap mt-2">
                    {#each genres as genre}
                        <div class="badge mx-2">{genre}</div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    {#if providers}
        <div class="flex-nowrap pt-5">
            {#each providers as provider}
                <div class="avatar p-1">
                    <div class="mb-8 w-20 h-20 mask mask-squircle">
                        <img
                            src="{IMG_URL}{provider.logo_path}"
                            alt={provider.provider_name}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
