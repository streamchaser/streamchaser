<script>
    import { mdiHome } from '@mdi/js';
    import { AppBar, Button, Icon, MaterialApp } from 'svelte-materialify';
    import { goto } from "@roxi/routify";
    import { currentCountry } from '../store.js';

    let value = $currentCountry;

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

  <select bind:value on:change={currentCountry.set(value)}>
	{#each countries as country}
		<option value={country.value}>{country.name}</option>
	{/each}
    </select>
</AppBar>
</MaterialApp>

<style>
    select {
        -webkit-appearance: button;
        -moz-appearance: button;
        -webkit-user-select: none;
        -moz-user-select: none;
        -webkit-padding-end: 20px;
        -moz-padding-end: 20px;
        -webkit-padding-start: 2px;
        -moz-padding-start: 2px;
        background-position: center right;
        background-repeat: no-repeat;
        border: 1px solid #AAA;
        border-radius: 2px;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        font-size: inherit;
        margin-right: 2%;
        overflow: hidden;
        padding-top: 2px;
        padding-bottom: 2px;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 100%;
    }
</style>