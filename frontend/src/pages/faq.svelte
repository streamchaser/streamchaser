<script>
    import {
        MaterialApp,
        ExpansionPanel,
        ExpansionPanels
    } from 'svelte-materialify';
    import Header from "../components/Header.svelte";
</script>

<MaterialApp>
    <Header/>
        <div class="container">
            <br>
            <h1 style="text-align: center">FAQ</h1>
            <br>
            <ExpansionPanels>
                <ExpansionPanel>
                    <span slot="header">Why cant I find a specific movie or tv show?</span>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse.
                  </ExpansionPanel>
                <ExpansionPanel>
                    <span slot="header">Why dont you support more countries?</span>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse.
                  </ExpansionPanel>
                <ExpansionPanel>
                    <span slot="header">I have a good idea, how do I contact you?</span>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse.
                  </ExpansionPanel>
                <ExpansionPanel>
                    <span slot="header">Where do you get your data from?</span>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse.
                  </ExpansionPanel>
                <ExpansionPanel>
                    <span slot="header">Why are some movies or tv shows missing provider logo underneath?</span>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat amet natus obcaecati
                    molestiae quas mollitia error modi atque aliquam esse.
                  </ExpansionPanel>
            </ExpansionPanels>
        </div>
</MaterialApp>