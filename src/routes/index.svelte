<script>
  import { onMount } from "svelte";
  onMount(() => {
    // document.documentElement.style.setProperty("--custom-page-bg", "white");
    // let bg = `linear-gradient(-135deg, rgba(255,125,255,0.75), rgba(105,125,255,0.5))`;
    // document.querySelector("#sapper").style.setProperty(`--custom-page-bg`, bg);


    // let bg2 = `linear-gradient(135deg, rgba(255,125,255,0.75), rgba(105,125,255,0.5))`;
    // let bg1 = `linear-gradient(-135deg, rgba(175,75,255,0.5), rgba(105,155,255,0.75))`;

    
    let bg1 = `linear-gradient(-240deg, rgba(255,25,255,0.25), rgba(25,155,255,0.5))`;
    let bg2 = `linear-gradient(-120deg, rgba(255,25,255,0.35), rgba(25,155,255,0.35))`;



    document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");

  });
</script>

<style>
  h1,
  figure,
  p {
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  figure {
    margin: 0 0 1em 0;
  }

  img {
    width: 100%;
    max-width: 400px;
    margin: 0 0 1em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<h1>Great success!</h1>

<figure>
  <img alt="Borat" src="great-success.png" />
  <figcaption>HIGH FIVE!</figcaption>
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>
