<script>
  let currentMessage = "",
    messages = [];
  // import * as chat from './../chat.js'
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import io from "socket.io-client";
  let socket = io();

  $: user = "";

  onMount(() => {
    // let bg1 = `linear-gradient(135deg, rgba(255,125,255,0.75), rgba(105,125,255,0.5))`;
    // let bg2 = `linear-gradient(-135deg, rgba(175,75,255,0.5), rgba(105,155,255,0.75))`;

    let bg1 = `linear-gradient(00deg, rgba(255,25,255,0.25), rgba(25,155,255,0.5))`;
    let bg2 = `linear-gradient(-240deg, rgba(255,25,255,0.35), rgba(25,155,255,0.35))`;

    document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");
    setTimeout(() => {
      // sapper.classList.toggle("transition");
    }, 500);

    // document.querySelector("#sapper").style.setProperty(`--custom-page-bg1`, bg);
    // document.querySelector("#sapper").style.setProperty(`--custom-page-bg1`, bg1);
  });

  function submitMsg() {
    // let msg = document.querySelector('#message').value

    let thisMsg = {
      username: user,
      body: currentMessage
    };
    messages = [...messages, thisMsg];
    socket.emit("message", thisMsg);
    console.log(
      `submitMsg function inside about.svelte ${socket.id} ||| ${user}::: ${currentMessage}`
    );
  }

  socket.on("message", message => {
    messages = [...messages, message];
    console.log(
      `client ${socket.id} received a message broadcast, ${message.username}: ${message.body}`
    );
    let feedback = document.querySelector("#feedback");
    feedback.innerHTML = ``;
  });

  socket.on("typing", username => {
    console.log(`receiving a typing emission... logged from about.svelte`);
    let feedback = document.querySelector("#feedback");
    feedback.innerHTML = `<p class="feedback">${username} is typing...</p>`;
  });

  function typing() {
    socket.emit("typing", user);
  }

  function emitUserDisconnect() {
    socket.emit("disconnected");
  }
</script>

<style lang="scss">
  .hero-body {
    align-items: flex-start;
    width: 100%;
    padding: 0;
  }

  .hero.fullscreen {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .frame {
    width: 100%;
    height: 80vh;
    box-shadow: none;
  }

  textarea {
    min-height: 50vh;
  }

  .chat-element {
    background: white;
    box-shadow: 1px 1px 3px rgba(50, 10, 110, 0.25);
    border-radius: 3px;
  }

  #chat-window {
    height: 50vh;
    width: 100%;
    margin-bottom: 1rem;
  }
  #message {
    border-radius: 3px 3px 0 0;
  }
  #send-message {
    border-radius: 0 0 3px 3px;
  }
  .btn-group {
    width: 100%;
    & button:last-child:not(:first-child) {
      margin-left: 0;
    }
  }

  :global(.feedback) {
    color: rgb(47, 255, 203);
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.25);
    transition: all 1s;
  }

  :global(.list-item) {
    display: flex;
    list-style: none;
  }
  .list-item-username,
  .list-item-message {
    background: rgba(5, 25, 15, 0.1);
    border-radius: 3px;
    padding: 3px 12px;
    margin: 3px;
  }
  .list-item-username {
    background: rgba(5, 25, 15, 0.2);
    width: 10ch;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>
<svelte:window on:unload={emitUserDisconnect} />

<form class="frame" method="post" on:submit|preventDefault={submitMsg}>
  <h1 class="u-text-center u-font-alt">Chat</h1>
  <div class="hero fullscreen">
    <div class="chat-container">

      <div class="form-group">
        <label class="form-group-label">
          <span class="icon">
            <i class="fa-wrapper far fa-user" />
          </span>
        </label>
        <label class="form-group-label">
          <span class="icon">
            <i class="fa-wrapper fas fa-palette" />
          </span>
        </label>
        <input
          id="username"
          type="text"
          class="form-group-input chat-element"
          placeholder="Enter your name"
          bind:value={user} />
      </div>

    </div>
    <div class="chat-window-group">
      <div class="chat-element" id="chat-window">
        <div id="feedback" />
        <ul id="messages">
          {#each messages as message}
            <li class="list-item" transition:fade>
              <div class="list-item-username">{message.username}:</div>
              <div class="list-item-message">{message.body}</div>
            </li>
          {/each}
        </ul>
      </div>

      <div class="btn-group chat-element">
        <input
          type="text"
          id="message"
          bind:value={currentMessage}
          on:keypress={typing}
          placeholder="What's up?" />

        <button class="btn-info" id="send-message">Send</button>
      </div>
    </div>
  </div>
</form>
