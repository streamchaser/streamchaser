<script>
  import Collapse from "../../components/collapse.svelte"
  import Avatar from "../../components/avatar.svelte"
</script>

<svelte:head>
  <title>About - Streamchaser</title>
</svelte:head>

<br />
<h1 class="text-center text-3xl">About</h1>
<br />
<Collapse
  title="The people behind"
  description="Streamchaser was initially founded in 2021 as part of our final project in
                  AP Computer Science where we came up with the idea behind the web application.
                  Since then, we have sought to evolve Streamchaser from the end-product of an exam
                  to a viable product for widespread use. We are a small development team composed of
                  four developers all studying to become software engineers and with many different
                  experiences in the field of software development."
/>
<Collapse
  title="Our vision"
  description="Streamchaser seeks to make the search for any kind of media located
                  on streaming services easier by curating all content through a centralized entertainment
                  technology platform. We aim to solve all troubles related to finding the right streaming
                  service for a given media type – be it movies, series or documentaries. Streamchaser
                  further seeks to solve the issue where and when it appears, most often in front of the TV.
                  Lastly, Streamchaser is founded on the basis of convenience, which means that no feature,
                  no profit margin and no personal gains should ever compromise the convenience and ease of
                  use for the customer."
/>

<h2 class="text-center text-3xl">Developers</h2>
<div class="flex justify-center space-x-1 p-4">
  <Avatar
    href="https://github.com/Primdahl26"
    img_src="https://avatars.githubusercontent.com/u/50198099?v=4"
  />
  <Avatar
    href="https://github.com/AndreasPB"
    img_src="https://avatars.githubusercontent.com/u/43907402?v=4"
  />
  <Avatar
    href="https://github.com/nullxDEADBEEF"
    img_src="https://avatars.githubusercontent.com/u/9653806?v=4"
  />
  <Avatar
    href="https://github.com/Pankai222"
    img_src="https://avatars.githubusercontent.com/u/48592277?v=4"
  />
</div>
