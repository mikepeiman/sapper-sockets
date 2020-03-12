<script>
  let currentMessage = "",
    messages = [];
  // import * as chat from './../chat.js'
  import { fade } from "svelte/transition";
  import io from "socket.io-client";
  let socket = io();

  function submitMsg() {
    // let msg = document.querySelector('#message').value
    let user = document.querySelector("#username").value;
    let thisMsg = {
      username: user,
      body: currentMessage
    }
    messages = [...messages, thisMsg];
    socket.emit("message", currentMessage);
    console.log(
      `submitMsg function inside about.svelte ${user}::: ${currentMessage}`
    );
  }

  socket.on("message", message => {
    messages = [...messages, message];
    console.log(`client received a message broadcast, ${message}`);
  });

  function emitUserDisconnect() {
    socket.emit('disconnected')
  }
</script>

<style>
  .hero-body {
    align-items: flex-start;
    width: 100%;
    padding: 0;
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
    color: greenyellow;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.25);
    transition: all 1s;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>
<svelte:window on:unload={emitUserDisconnect}
<form class="frame" method="post" on:submit|preventDefault={submitMsg}>
  <space class="medium" />
  <!-- <div class="padded content"> -->
  <h1 class="u-text-center u-font-alt">Chat</h1>
  <r-grid columns="8">
    <r-cell span="1-2" class="hero fullscreen">
      <div class="hero-body">
        <!-- <div class="content"> -->

        <div class="frame__body u-no-padding">
          <div class="row u-no-padding level fill-height">
            <div class="col">

              <r-grid columns="8">
                <r-cell span="row" span-s="row">
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
                      placeholder="Enter your name" />
                  </div>
                  <div class="divider" />
                  <p class="u-text-center">Enter a name and chat away!</p>
                  <div class="divider" />
                </r-cell>

              </r-grid>
            </div>
            <space class="x-large" />
          </div>
        </div>
        <!-- </div> -->

      </div>
      <!-- </div> -->
    </r-cell>
    <r-cell span="3-8" span-s="row">
      <div class="chat-window-group">
        <div id="chat-window">
          <div id="feedback" />
          <ul id="messages">
            {#each messages as message}
              <li transition:fade>{message.username}: {message.body}</li>
            {/each}
          </ul>
        </div>
        <input
          type="text"
          id="message"
          bind:value={currentMessage}
          placeholder="What's up?" />

      </div>
      <div class="btn-group u-pull-right">
        <button class="btn-info" id="send-message">Send</button>
      </div>
    </r-cell>
  </r-grid>
</form>
