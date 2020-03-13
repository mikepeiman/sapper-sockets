<script>
  import Nav from "../components/Nav.svelte";

  export let segment;

  import { onMount } from "svelte";
  onMount(() => {
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");
    // document.documentElement.classList.toggle("transition");
  });
</script>

<style global>
  :global(#sapper) {
    background: var(--custom-page-bg);
    transition: all 01.25s;
  }
  :global(.main) {
    background: var(--custom-page-bg);
    transition: all 01.25s;
  }
  :global(body) {
    background: var(--custom-page-bg);
    transition: all 01.25s;
  }
  .transition {
    background: var(--custom-page-bg);
    /* transition: all 0.25s; */
  }
  main {
    position: relative;
    max-width: 100vw;
    /* background-color: white; */
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
