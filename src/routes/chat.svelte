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
  // import Pickr from '@simonwep/pickr';
  // import '@simonwep/pickr/dist/themes/classic.min.css';
  let socket = io();
  let initialized = false;
  import {
    storeUsernames,
    storeThisUser,
    storeThisColor,
    storeThisEmoji
  } from "./../stores.js";
  $: user = "";
  let generatedUsername,
    placeholderName,
    avatar,
    avatarUrl,
    avatarSrc,
    emojiPicked,
    emojiPicker,
    currentColor,
    usernames = [];

  $: bg1 = `linear-gradient(00deg, rgba(255,25,255,0.25), ${currentColor})`;
  $: bg2 = `linear-gradient(-240deg, ${currentColor}, rgba(25,155,255,0.35))`;

  $: {
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", e => {
        console.log(
          `Window about to unload, current client data is username ${user} color ${currentColor} emoji ${emojiPicked}`
        );
        storeThisColor.set(currentColor);
        storeThisEmoji.set(emojiPicked);
        storeThisUser.set(user);
        storeUsernames.set(usernames);
      });

      document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
      document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    }
  }

  emojiPicked = "...";
  currentColor = "rgba(255,25,255,0.35)";
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

  socket.on("usernames", users => {
    usernames = users;
    console.log(
      `\nclient.username ${socket.username} receiving updated usernames: ${usernames}`
    );
  });

    socket.on("users", users => {
    // usernames = users;
    console.log(
      `client.username ${socket.username} receiving full list users objects`
    );
    console.dir(users,`\n`)
  });

  onMount(async () => {
    // localStorage.debug = '*';

    if (!initialized) {
      let rand = getRandomInt(0, emojis.length);
      console.log(
        `random ${rand} emojis length ${emojis.length}: ${emojis[rand]}`
      );
      emojiPicked = await emojis[rand];
      emojiPicker = new EmojiButton({ zIndex: 99 });
      user = generatedUsername = generate({ number: true }).dashed;
      console.log(`Chat onMount socket.id ${socket.id}, generated username ${generatedUsername}`);
      placeholderNameInit();
      avatarInit();
      colorPickerInit();
      socket.emit(
        "client loaded",
        { user: user, color: currentColor, emoji: emojiPicked },
        exists => {
          if (!exists) {
            socket.username = user;
            storeThisUser.set(user)
            console.log(
              `client receiving signal that this username ${user} is valid - and set to socket.username ${socket.username}`
            );
          } else {
            console.log(
              `client socket.username ${socket.username} receiving signal that this username ${user} is INVALID`
            );
          }
        }
      );
    }

    document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");

    initialized = true;
  });

  function colorPickerInit() {
    const pickr = Pickr.create({
      el: ".color-picker",
      container: ".user-info",
      appClass: "chat-color-picker",
      autoReposition: false,
      theme: "classic", // or 'monolith', or 'nano'

      swatches: [
        "rgba(244, 67, 54, 1)",
        "rgba(233, 30, 99, 0.95)",
        "rgba(156, 39, 176, 0.9)",
        "rgba(103, 58, 183, 0.85)",
        "rgba(63, 81, 181, 0.8)",
        "rgba(33, 150, 243, 0.75)",
        "rgba(3, 169, 244, 0.7)",
        "rgba(0, 188, 212, 0.7)",
        "rgba(0, 150, 136, 0.75)",
        "rgba(76, 175, 80, 0.8)",
        "rgba(139, 195, 74, 0.85)",
        "rgba(205, 220, 57, 0.9)",
        "rgba(255, 235, 59, 0.95)",
        "rgba(255, 193, 7, 1)"
      ],

      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: false,
          cmyk: false,
          input: true,
          clear: true,
          save: true
        }
      }
    });
    pickr.on("init", instance => {
      // Grab actual input-element
      const { result } = instance.getRoot().interaction;

      // Listen to any key-events
      result.addEventListener(
        "keydown",
        e => {
          // Detect whever the user pressed "Enter" on their keyboard
          if (e.key === "Enter") {
            instance.applyColor(); // Save the currenly selected color
            instance.hide(); // Hide modal
          }
        },
        { capture: true }
      );
    });

    pickr.on("change", color => {
      console.log(`color is changiiiiiiing! `, color, color.toRGBA());
      let rgba = color.toRGBA();
      currentColor = `rgba(${Math.round(rgba[0])}, ${Math.round(
        rgba[1]
      )}, ${Math.round(rgba[2])}, ${rgba[3].toFixed(2)})`;
      console.log(`currentColor constructed as RGBA: ${currentColor}`);
    });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function submitMsg() {
    // let msg = document.querySelector('#message').value
    if (currentMessage.length > 0) {
      let thisMsg = {
        username: user,
        body: currentMessage
      };
      messages = [...messages, thisMsg];
      socket.emit("message", thisMsg);
    }
    if (user !== socket.username) {
      console.log(
        `submitMsg function inside about.svelte ${socket.username} does not equal current username ${user} (no message: ${currentMessage})`
      );
      if (checkIsUserNameValid(user)) {
        updateUserName();
      }
    }
    console.log(
      `submitMsg function inside about.svelte ${socket.id} ||| ${user}::: ${currentMessage}`
    );
  }

  function typing() {
    socket.emit("typing", user);
  }

  function emitUserDisconnect() {
    // socket.emit("disconnected");
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

  function checkIsUserNameValid(str) {
    if (usernames.indexOf(str) == -1) {
      console.log(`checkIsUserNameValid returns true (unique) for ${str}`);
      return true;
    } else {
      console.log(`checkIsUserNameValid returns false (duplicate) for ${str}`);
      return false;
    }
  }
  function onBlur(e) {
    user.length > 1 ? user : (user = generatedUsername);
    if (checkIsUserNameValid(user)) {
      updateUserName();
    }
    console.log(
      `onBlur e.target.value.length ${e.target.value.length} e.target.value ${e.target.value} generatedUsername ${generatedUsername}`
    );
  }

  function onKeypress(e) {
    if (e.keyCode == 13) {
      checkIsUserNameValid(user);
    }
  }

  function updateUserName() {
    socket.emit("update username", user);
    socket.username = user;
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
  :global(.pcr-app.chat-color-picker) {
    width: auto;
    left: 2.5vw;
  }
  :global(.pcr-app.chat-color-picker .pcr-swatches) {
    grid-template-columns: repeat(auto-fit, minmax(1.75em, auto));
  }
  :global(.pcr-app.chat-color-picker .pcr-interaction) {
    flex-wrap: nowrap;
  }
  :global(.pcr-app
      input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]), select) {
    padding: 0.5rem;
  }
  :global(.pcr-app.chat-color-picker .pcr-last-color) {
    padding: 0;
    margin: 0;
    border-bottom: 2px solid white;
  }
  :global(.pcr-app.chat-color-picker .pcr-current-color) {
    padding: 0;
    margin: 0;
    border-top: 2px solid white;
  }
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
    width: auto;
    white-space: nowrap;
    overflow: hidden;
  }
  .usernames-list {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.25);
    padding: 1rem;
    border-radius: 3px;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>
<svelte:window on:unload={emitUserDisconnect} />

<form class="frame" method="post" on:submit|preventDefault={submitMsg}>
  <h1 class="u-text-center u-font-alt">Chat</h1>
  <div class="usernames-list">
    {#each usernames as user}
      <div>{user}</div>
    {/each}
  </div>
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
          <span class="icon palette color-picker">
            <!-- <i class="fa-wrapper fas fa-palette" /> -->
          </span>
        </label>
        <input
          id="username"
          type="text"
          class="form-group-input"
          on:focus={onFocus}
          on:blur={onBlur}
          on:keypress={onKeypress}
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
