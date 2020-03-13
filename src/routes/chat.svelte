<script>
  let currentMessage = "",
    messages = [];
  // import * as chat from './../chat.js'
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import io from "socket.io-client";
  import generate from "project-name-generator";
  import EmojiButton from "@joeattardi/emoji-button";
  import emojis from "emojis-list";
  let socket = io();

  $: user = "";
  let generatedUsername,
    placeholderName,
    avatar,
    avatarUrl,
    avatarSrc,
    emojiPicked,
    emojiPicker;

  emojiPicked = "...";
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

  socket.on("avatar returned", data => {
    console.log(`on avatar returned to client, data `, data);
    avatarSrc = data;
  });

  onMount(() => {
    let rand = getRandomInt(0, emojis.length);
    console.log(
      `random ${rand} emojis length ${emojis.length}: ${emojis[rand]}`
    );
    emojiPicked = emojis[rand];
    emojiPicker = new EmojiButton({ zIndex: 99 });
    // let bg1 = `linear-gradient(135deg, rgba(255,125,255,0.75), rgba(105,125,255,0.5))`;
    // let bg2 = `linear-gradient(-135deg, rgba(175,75,255,0.5), rgba(105,155,255,0.75))`;

    let bg1 = `linear-gradient(00deg, rgba(255,25,255,0.25), rgba(25,155,255,0.5))`;
    let bg2 = `linear-gradient(-240deg, rgba(255,25,255,0.35), rgba(25,155,255,0.35))`;

    document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");
    user = generatedUsername = generate({ number: true }).dashed;
    console.log(`Chat onMount, generated username ${generatedUsername}`);
    placeholderNameInit();
    avatarInit();
  });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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

  function typing() {
    socket.emit("typing", user);
  }

  function emitUserDisconnect() {
    socket.emit("disconnected");
  }

  function placeholderNameInit() {
    // generatedUsername = generate({ number: true }).dashed;
    console.log(`placeholderName: user ${user} generated ${generatedUsername}`);
    if (user == generatedUsername) {
      console.log(
        `placeholderName: user ${user} MATCHES generated ${generatedUsername}`
      );
      return (placeholderName = `Enter your name (or use random: ${generatedUsername})`);
      console.log(`placeholderName should be ${placeholderName}`);
    } else {
      return (placeholderName = user);
    }
  }

  function avatarInit() {
    socket.emit("avatar init", true);
  }

  function onFocus(e) {
    e.target.select();
  }
  function onBlur(e) {
    e.target.value.length > 1
      ? (user = e.target.value)
      : (user = generatedUsername);
    console.log(
      `onBlur e.target.value.length ${e.target.value.length} e.target.value ${e.target.value} generatedUsername ${generatedUsername}`
    );
  }

  function togglePicker(e) {
    console.log(`toggle emoji picker e.target `, e.target);
    let target = document.querySelector("form.frame");
    emojiPicker.togglePicker(e.target);
    emojiPicker.on("emoji", emoji => {
      console.log(`returned emoji ${emoji}`);
      emojiPicked = emoji;
    });
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
    max-width: 60em;
    align-self: center;
  }

  .form-group-label {
    position: relative;
  }

  .frame {
    width: 100%;
    height: 80vh;
    box-shadow: none;
  }

  textarea {
    min-height: 50vh;
  }
  .chat-container {
    & .user-info {
      display: flex;
      align-items: center;
      & h6 {
        margin-left: 2rem;
      }
    }
  }
  .chat-element {
    background: white;
    border-radius: 3px;
    &:active,
    &:focus {
      box-shadow: 1px 1px 3px rgba(50, 10, 110, 0.25);
    }
  }

  .icon {
    &.checkmark {
      color: rgba(0, 255, 55, 1);
    }
  }

  .emoji-wrapper {
    display: flex;
    font-size: 2rem;
    align-items: center;
  }
  #chat-window {
    height: 50vh;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
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
      <div class="user-info">
        <div class="emoji-wrapper" width="50" height="50">{emojiPicked}</div>
        <h6>
          Your username:
          <span class="username">{user}</span>
        </h6>
      </div>
      <div class="form-group chat-element">
        <label class="form-group-label" on:click={togglePicker}>
          <span class="icon user">
            <!-- <i class="fa-wrapper far fa-user" /> -->
            {emojiPicked}
          </span>
        </label>
        <label class="form-group-label">
          <span class="icon palette">
            <i class="fa-wrapper fas fa-palette" />
          </span>
        </label>
        <input
          id="username"
          type="text"
          class="form-group-input"
          placeholder={placeholderName}
          on:focus={onFocus}
          on:blur={onBlur}
          bind:value={user} />
        <label class="form-group-label">
          <span class="icon checkmark">
            <i class="fa-wrapper fas fa-check" />
          </span>
        </label>
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
