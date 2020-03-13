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
  #sapper {
    background: var(--custom-page-bg1);
    transition: all 01.25s;
    z-index: 1;
    position: relative;
    width: 100%;
    height: 100%;
    &:before {
      content: "";
      background: var(--custom-page-bg2);
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      transition: all 1s;
      opacity: 0;
      z-index: -1;
    }
    &.transition::before {
      opacity: 1;
    }
  }

  main {
    position: relative;
    max-width: 100vw;
    /* background-color: white; */
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }

  nav ul li {
          margin-top: 0;
      margin-bottom: 0;
    // &:first-child, &:last-child {
    //   margin-top: 0;
    //   margin-bottom: 0;
    // }
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
