<script>
    import { mdiMenu, mdiHome } from '@mdi/js';
    import { AppBar, Button, Menu, ListItem, Icon, MaterialApp } from 'svelte-materialify';
</script>

<MaterialApp>
<AppBar flat>
  <Button text onclick="window.location.href='/'">
    <Icon path={mdiHome}/> Placeholder
  </Button>
  <div style="flex-grow:1"></div>
  <Button style="margin-right: 5px">Roulette</Button>
  <Menu right>
    <div slot="activator">
      <Button fab depressed>
        <Icon path={mdiMenu} />
      </Button>
    </div>
    <ListItem>Item 1</ListItem>
    <ListItem>Item 2</ListItem>
    <ListItem>Item 3</ListItem>
  </Menu>
</AppBar>
</MaterialApp>
