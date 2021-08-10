<script>
    import { mdiHome } from '@mdi/js';
    import { AppBar, Button, Icon, MaterialApp } from 'svelte-materialify';
    import { goto } from "@roxi/routify";
    import { currentCountry } from '../store.js';

    let value = 'DK';

    const countries = [
            {name: 'Denmark', value: 'DK'},
            {name: 'Germany', value: 'DE'},
            {name: 'Sweden', value: 'SE'},
            {name: 'UK', value: 'GB'},
            {name: 'USA', value: 'US'}];

</script>

<MaterialApp>
<AppBar flat>
  <Button text rounded onclick="window.location.href='/'">
    <Icon path={mdiHome}/> streamchaser
  </Button>
  <div style="flex-grow:1"></div>
  <Button on:click={$goto('/about')} text rounded style="margin-right: 3%">About Us</Button>
  <Button on:click={$goto('/faq')} text rounded style="margin-right: 3%">FAQ</Button>

  <select style="margin-right: 3%" bind:value on:change={currentCountry.set(value)}>
	{#each countries as country}
		<option value={country.value}>{country.name}</option>
	{/each}
    </select>
</AppBar>
</MaterialApp>
