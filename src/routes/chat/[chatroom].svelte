<script>
  let currentMessage = "",
    messages = [];
  // import * as chat from './../chat.js'
  import { fade } from "svelte/transition";
  import { onMount, onDestroy } from "svelte";
  import io from "socket.io-client";
  import generate from "project-name-generator";
  import EmojiButton from "@joeattardi/emoji-button";
  import emojis from "emojis-list";
  // import Pickr from '@simonwep/pickr';
  // import '@simonwep/pickr/dist/themes/classic.min.css';

  let initialized = false;
  import {
    storeUsernames,
    storeThisUser,
    storeThisColor,
    storeThisEmoji,
    storeRoomName,
    storeChatUnderway
  } from "./../../stores.js";
  $: user = "";

  let roomName = "";
  let socket = io();
  $: roomName;
  let generatedUsername,
    placeholderName,
    avatar,
    avatarUrl,
    avatarSrc,
    emojiPicked,
    emojiPicker,
    currentColor,
    color1,
    color2,
    gradientDegrees1,
    gradientDegrees2,
    usernames = [],
    rooms = [],
    room = '',
    generatedRoomName,
    chatInitiated = false;

  $: bg1 = `linear-gradient(${gradientDegrees1}deg, ${color2}, ${color1})`;
  $: bg2 = `linear-gradient(${gradientDegrees2}deg, ${color1},${color2})`;

  emojiPicked = "...";
  currentColor = "rgba(255,25,255,0.35)";

  socket.on("rooms", data => {
    rooms = data;
    console.log(`socket.on rooms in client, populate rooms array`, rooms);
  });

  socket.on("broadcast message", message => {
    messages = [...messages, message];
    console.log(
      `\nclient ${socket.id} received a message broadcast, ${message.username}: ${message.body}\n`
    );
    let feedback = document.querySelector("#feedback");
    feedback.innerHTML = ``;
  });

  socket.on("typing", username => {
    console.log(`receiving a typing emission... logged from about.svelte`);
    let feedback = document.querySelector("#feedback");
    feedback.innerHTML = `<p class="feedback">${username} is typing...</p>`;
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
    console.dir(users, `\n`);
  });

  onMount(async () => {
    generateRandomColors()
    generateRandomEmoji()
    let url = window.location.href;
    let str = url.split('chat/')
    roomName = str[1]
    socket.emit('joined room', user, roomName)
    localStorage.debug = "false";
    if (!initialized) {
      emojiPicker = new EmojiButton({ zIndex: 99 });
      user = generatedUsername = generate({ number: true }).dashed;
      // roomName = generatedRoomName = generate({ number: false }).dashed;
      console.log(
        `Chat onMount socket.id ${socket.id}, generated username ${generatedUsername}`
      );
      console.log(`window object for location `, window.location);
      // placeholderNameInit();
      // avatarInit();
    }

    document.documentElement.style.setProperty(`--custom-page-bg1`, bg1);
    document.documentElement.style.setProperty(`--custom-page-bg2`, bg2);
    let sapper = document.querySelector("#sapper");
    sapper.classList.toggle("transition");
    if (checkIsUserNameValid(user)) {
      updateUserName();
    }
    initialized = true;
  });

  onDestroy(() => {
    console.log(`chatroom ${roomName} called onDestroy(), user ${user} left`)
        socket.emit("left chatroom", roomName, user);
  })

    function generateRandomColors() {
    let r1 = getRandomInt(0, 255);
    let g1 = getRandomInt(0, 255);
    let b1 = getRandomInt(0, 255);
    color1 = `rgba(${r1}, ${g1},${b1},0.45)`;
    let r2 = getRandomInt(0, 255);
    let g2 = getRandomInt(0, 255);
    let b2 = getRandomInt(0, 255);
    color2 = `rgba(${r2}, ${g2},${b2},0.45)`;
    gradientDegrees1 = getRandomInt(0, 360);
    gradientDegrees2 = getRandomInt(0, -360);
    bg1 = `linear-gradient(${gradientDegrees1}deg, ${color2}, ${color1})`;
    bg2 = `linear-gradient(${gradientDegrees2}deg, ${color1}, ${color2})`;
  }

  async function generateRandomEmoji() {
    let rand = getRandomInt(0, emojis.length);
    emojiPicked = await emojis[rand];
  }

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
        body: currentMessage,
        room: $storeRoomName
      };
      messages = [...messages, thisMsg];
      socket.emit("chat message", thisMsg);
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
    socket.emit("typing", user, $storeRoomName);
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
      console.log(
        `checkIsUserNameValid returns true (unique) for ${str}`,
        usernames
      );
      return true;
    } else {
      console.log(
        `checkIsUserNameValid returns false (duplicate) for ${str}`,
        usernames
      );
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

  .chat-input-group {
    align-self: flex-end;
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

  .rooms-list {
    display: flex;
    flex-direction: column;
    & a {
      padding: 0.5rem;
      border-radius: 3px;
      background: rgba(205, 255, 255, 0.5);
    }
  }
</style>

<svelte:head>
  <title>Chatroom: {roomName}</title>
</svelte:head>

<form class="frame" method="post" on:submit|preventDefault={submitMsg}>
  <h1 class="u-text-center u-font-alt">Chatroom: {roomName}</h1>

  <div class="hero fullscreen">
    <r-grid columns="8">
      <r-cell span="1-3">
        <div class="chat-container">
          <div class="user-info">
            <div class="emoji-wrapper" width="50" height="50">
              {emojiPicked}
            </div>
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
              <span
                class="icon palette color-picker"
                on:load={colorPickerInit()}>
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
        <div class="usernames-list">
          {#each usernames as user}
            <div>{user}</div>
          {/each}
        </div>
        <div class="btn-group chat-element chat-input-group">
          <input
            type="text"
            id="message"
            bind:value={currentMessage}
            on:keypress={typing}
            placeholder="What's up?" />

          <button class="btn-info" id="send-message">Send</button>
        </div>
      </r-cell>
      <r-cell span="4-8">

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

        </div>
      </r-cell>
    </r-grid>
  </div>
</form>
