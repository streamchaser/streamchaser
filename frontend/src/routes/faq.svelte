<script>
    import Collapse from "../components/collapse.svelte";
    import Footer from "../components/footer.svelte";
    import Navbar from "../components/navbar.svelte";
</script>


<div class="flex flex-col h-screen">
    <Navbar/>
    <div class="mb-auto mx-auto items-center px-2">
        <br>
        <h1 class="text-center text-3xl">FAQ</h1>
        <br>
        <Collapse title="Why cant I find a specific movie or tv show?"
                  description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse."/>
        <Collapse title="Why dont you support more countries?"
                  description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse."/>
        <Collapse title="I have a good idea, how do I contact you?"
                  description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse."/>
        <Collapse title="Where do you get your data from?"
                  description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse."/>
        <Collapse title="Why are some movies or tv shows missing provider logo underneath?"
                  description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse."/>

    </div>
    <Footer/>
</div>

