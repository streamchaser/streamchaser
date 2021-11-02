<script lang="ts">
    import Navbar from "../components/navbar.svelte";
    import Footer from "../components/footer.svelte";
    import Error from "../components/error.svelte";
    import CookieDisclaimer from '../components/cookie_disclaimer.svelte'
    import { onMount } from "svelte";

    // This is a temp fix for the firefox dyanmic import bug
    // TODO: Find a proper way to fix the dynamic import issue a remove this
    let loadError = false;

    onMount(async () => {
        setTimeout(() => (loadError = true), 100);
    });
</script>

<svelte:head>
    {#if loadError}
        <title>404 Page not found</title>
    {/if}
</svelte:head>

{#if loadError}
    <div class="flex flex-col h-screen justify-between">
        <Navbar />
        <Error error={"404 Page not found"} />
        <Footer />
    </div>
{/if}
<CookieDisclaimer />
