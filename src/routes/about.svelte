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
    let bg = `linear-gradient(135deg, rgba(255,125,255,0.75), rgba(105,125,255,0.5))`;
    // document.documentElement.style.setProperty(`--custom-page-bg`, bg)
    document.querySelector("#sapper").style.setProperty(`--custom-page-bg`, bg);
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

<style>
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
  }

  textarea {
    min-height: 50vh;
  }

  #chat-window {
    /* background: rgba(25,5,55,0.1); */
    border-radius: 3px;
    height: 50vh;
    width: 100%;
    border: 3px solid rgba(50, 10, 110, 0.15);
    margin-bottom: 1rem;
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
  <space class="small" />
  <h1 class="u-text-center u-font-alt">Chat</h1>
  <div class="hero fullscreen">
    <div class="chat-container">

      <div class="form-group">
        <label class="form-group-label">
          <span class="icon">
            <i class="fa-wrapper far fa-user" />
          </span>
        </label>
        <input
          id="username"
          type="text"
          class="form-group-input"
          placeholder="Enter your name"
          bind:value={user} />
      </div>

    </div>
    <div class="chat-window-group">
      <div id="chat-window">
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
      <input
        type="text"
        id="message"
        bind:value={currentMessage}
        on:keypress={typing}
        placeholder="What's up?" />

    </div>
    <div class="btn-group u-pull-right">
      <button class="btn-info" id="send-message">Send</button>
    </div>
  </div>
</form>
