<script>
    import { mdiMenu, mdiHome } from '@mdi/js';
    import { AppBar, Button, Menu, ListItem, Icon, MaterialApp, Select } from 'svelte-materialify';
    import {goto} from "@roxi/routify";

    const countries = [
            {name: 'Denmark', value: 'dk'},
            {name: 'Germany', value: 'de'},
            {name: 'Sweden', value: 'se'},
            {name: 'UK', value: 'gb'},
            {name: 'USA', value: 'us'}]

</script>

<MaterialApp>
<AppBar flat>
  <Button text rounded onclick="window.location.href='/'">
    <Icon path={mdiHome}/> streamchaser
  </Button>
  <div style="flex-grow:1"></div>
  <Button on:click={$goto('/about')} text rounded style="margin-right: 3%">About Us</Button>
  <Button on:click={$goto('/faq')} text rounded style="margin-right: 3%">FAQ</Button>
  <div class="d-flex flex-row">
    <div class="pa-2 ma-1">
      <Select filled items={countries}>Country</Select>
    </div>
  </div>
</AppBar>
</MaterialApp>
