<script lang="ts">
    import ReadMore from "./read_more.svelte";

    export let backdropPath: string
    export let imgUrl: string
    export let posterPath: string
    export let title: string
    export let overview: string
    export let overviewLength: number
    export let initialOverviewLength: number
    export let genres: []
    export let providers: []
</script>

<div
    class="flex items-center w-full px-4 py-10 bg-cover card bg-base-200"
    style="background-image: url(&quot;{imgUrl}{backdropPath}&quot;);e">
    <div class="card glass lg:card-side text-neutral-content">
        <figure class="p-6">
            <img
                src="{imgUrl}{posterPath}"
                class="object-contain h-96 w-full rounded-lg"
                alt={title}
            />
        </figure>
        <div class="max-w-md card-body">
            <h2 class="card-title">{title}</h2>
            <ReadMore
                currentDescriptionLength={overviewLength}
                mediaDescription={overview}
                initialDescriptionLength={initialOverviewLength}
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
                <div class="avatar p-2">
                    <div class="mb-8 w-24 h-24 mask mask-squircle">
                        <img
                            src="{imgUrl}{provider.logo_path}"
                            alt={provider.provider_name}
                        />
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
