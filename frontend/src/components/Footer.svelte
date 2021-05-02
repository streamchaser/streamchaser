<script>
    import {
        Footer,
        Button,
    } from 'svelte-materialify';

    const links = ['FAQ', 'Privacy policy', 'Contact us', 'About us'];
    const logos = {
        'Facebook logo': 'img/facebook_logo.png',
        'Twitter logo': 'img/twitter_logo.png',
        'Instagram logo': 'img/instagram_logo.png'
    };

</script>

<Footer absolute padless class="white theme--dark flex-box">
    <div class="footer flex-box" style="padding: 10px">
        <div class="mt-2 mb-2">
            {#if links}
                {#each links as link}
                  <Button onclick="window.location.href='https://www.youtube.com/watch?v=yPYZpwSpKmA';" text rounded class="black-text" style="padding: 0 60px 0 60px">{link}</Button>
                {/each}
            {/if}
            </div>
            <div style="float: right">
            {#if logos}
                {#each  Object.entries(logos) as [alt, src]}
                    <Button text rounded><img {src} {alt}></Button>
                {/each}
            {/if}
        </div>
    </div>
</Footer>

<style>
    .footer {
        border-top: solid black;
        border-width: thin;
        width: 100%;
    }

    img {
        max-width: 50px;
        height: auto;
        border-radius: 50%;
    }

    div {
        display: inline;

    }
</style>