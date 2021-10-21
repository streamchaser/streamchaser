<script lang="ts">
    import Navbar from '../components/navbar.svelte';
    import Footer from '../components/footer.svelte';
    import Error from '../components/error.svelte';

</script>

<svelte:head>
    <title>404 Page not found</title>
</svelte:head>

<div class="flex flex-col h-screen justify-between">
    <Navbar />
    <Error error={'404 Page not found'} />
    <Footer/>
</div>
