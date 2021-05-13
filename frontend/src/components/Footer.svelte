<script>
    import {
        Footer,
        Button,
        Icon
    } from 'svelte-materialify';
    import {fly, slide} from 'svelte/transition';
    import {mdiChevronUp} from '@mdi/js'

    const links = ['FAQ', 'Privacy policy', 'Contact us', 'About us'];
    const logos = {
        'Facebook logo': 'img/facebook_logo.png',
        'Twitter logo': 'img/twitter_logo.png',
        'Instagram logo': 'img/instagram_logo.png'
    };

    let toggle = false;

    function setToggle() {
        toggle = !toggle;
    }

    export let y = 0;

</script>

<!-- listening for scroll events -->
<svelte:window bind:scrollY={y}/>

<Footer padless class="white theme--dark flex-box">
    <div class="icon">
        <Button text rounded class="black-text" on:click={setToggle}>
            <Icon class="black-text" path={mdiChevronUp} rotate={toggle ? 180 : 0}/>
        </Button>
    </div>
    {#if toggle}
        <div transition:slide="{{ y: 100, duration: 800 }}" class="footer flex-box"
             style="padding: 10px">
            <div class="mt-2 mb-2">
                {#if links}
                    {#each links as link}
                        <Button onclick="window.location.href='https://www.youtube.com/watch?v=yPYZpwSpKmA';"
                                text rounded class="black-text"
                                style="padding: 0 60px 0 60px">{link}</Button>
                    {/each}
                {/if}
            </div>
            <div style="float: right">
                {#if logos}
                    {#each Object.entries(logos) as [alt, src]}
                        <Button text rounded><img {src} {alt}></Button>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</Footer>

<style>
    .footer {
        position: fixed;
        bottom: 0;
        background-color: white;
        border-top: solid black;
        border-width: thin;
        width: 100%;
        z-index: 99;
    }
    img {
        max-width: 50px;
        height: auto;
        border-radius: 50%;
    }
    div {
        display: inline;
        transition: transform 300ms linear;
    }
    .icon {
        position: fixed;
        color: black;
        bottom: 60px;
    }
</style>