import { storeUsernames } from './stores.js'


// import * as chat from './../chat.js'
import { fade } from "svelte/transition";
import io from "socket.io-client";
let socket = io.connect('/chat');


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