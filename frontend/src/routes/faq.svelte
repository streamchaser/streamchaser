<script>
  import Collapse from "../components/collapse.svelte"
</script>

<svelte:head>
  <title>FAQ - Streamchaser</title>
</svelte:head>

<br />
<h1 class="text-center text-3xl">FAQ</h1>
<br />
<Collapse
  title="Why can't I find a specific movie or TV show?"
  description="Our selection of movies and TV-series is currently limited to what content
                  is provided in the TMDb database. We therefore cannot guarantee that every single movie
                  and tv-show will be available for search. As new media is added to the database each day,
                  it may become available in the future."
/>
<Collapse
  title="Why don't you support more countries?"
  description="As we’re a newly started company our resources are at this time sparse.
                  Adding support for more countries would therefore affect performance of our platform
                  considerably. As streamchaser grows we will extend support to many more countries."
/>
<Collapse
  title="I have a good idea, how do I contact you?"
  description="We are working on making the creation of issues on our GitHub-page possible.
                  In the future, a support-email will be established for both receiving ideas and complaints
                  from you, our users."
/>
<Collapse
  title="Where do you get your data from?"
  description="For querying media in our application, we are using the TMDb API. TMDb
                  is a community-built database comprising every movie, series and actor/actress available
                  for search on our website. You can read more about TMDb and the TMDb API"
  link="https://developers.themoviedb.org/3/getting-started/introduction"
  linkText="here"
/>
