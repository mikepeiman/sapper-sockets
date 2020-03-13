<script>
  import Nav from "../components/Nav.svelte";

  export let segment;

  import { onMount } from "svelte";
  onMount(() => {
    // let sapper = document.querySelector("#sapper");
    // sapper.classList.add("transition");
    // setTimeout(() => {
    //   sapper.classList.remove("transition");
    // }, 1000);

    // document.documentElement.classList.toggle("transition");
  });
</script>

<style lang="scss" global>
  :global(#sapper) {
    background: var(--custom-page-bg1);
    transition: all 01.25s;
    z-index: 1;
    position: relative;
    &:before {
      content: "";
      background: var(--custom-page-bg2);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      // width: 100%;
      // height: 100%;
      transition: all 1s;
      opacity: 0;
      z-index: -1;
    }
    &.transition::before {
      opacity: 1;
    }
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
