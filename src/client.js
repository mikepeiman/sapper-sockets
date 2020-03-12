// import * as chat from './chat.js'
import * as sapper from "@sapper/app";
// import io from "socket.io-client";
// let client_socket = io();
// import client_socket from 'socket.io-client'

console.log(`window.location now: ${window.location}`);

sapper.start({
  target: document.querySelector("#sapper")
});
// const client_socket = io.connect(window.origin)

// const client_socket = io.connect(window.origin);
// // let client_socket = io();
// console.log(`chat.js loaded, window.origin: `, window.origin);
// console.log(`chat.js loaded, client_socket.id: `, client_socket.id);
// let  feedback = document.querySelector("#feedback"),
//   username = document.querySelector("#username"),
//   submit = document.querySelector("#send-message"),
//   message = document.querySelector("#message");

// // emit event
// submit.addEventListener("click", () => {
//   let msg = {
//     body: message.value,
//     user: username.value
//   };
//   client_socket.emit("new message", msg);
// });

// feedback.addEventListener("keypress", user => {
//   client_socket.emit("typing", user);
// });
// // listen for events

// client_socket.on("chat", msg => {
//   console.log(
//     `client ${client_socket.id} has received a chat msg of ${msg.body} from ${msg.user} with client client_socket id ${client_socket.id}`
//   );
//   // output.innerHTML += `<p><strong>${msg.user}:</strong> ${msg.body}</p>`;
// });

// client_socket.on("typing", user => {
//   console.log(`typing message from ${user}`);
//   feedback.innerHTML = `<p class="feedback">${user} is typing...</p>`;
// });
