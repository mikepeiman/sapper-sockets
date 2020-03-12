const clientSocket = io.connect(window.origin);
// let clientSocket = io();
console.log(`chat.js loaded, window.origin: `, window.origin);
console.log(`chat.js loaded, clientSocket.id: `, clientSocket.id);
let output = document.querySelector("#output"),
  feedback = document.querySelector("#feedback"),
  username = document.querySelector("#username"),
  submit = document.querySelector("#send-message"),
  message = document.querySelector("#message");

// emit event
submit.addEventListener("click", () => {
  let msg = {
    body: message.value,
    user: username.value
  };
  clientSocket.emit("new message", msg);
});

feedback.addEventListener("keypress", user => {
  clientSocket.emit("typing", user);
});
// listen for events

clientSocket.on("chat", msg => {
  console.log(
    `client ${clientSocket.id} has received a chat msg of ${msg.body} from ${msg.user} with client socket id ${clientSocket.id}`
  );
  output.innerHTML += `<p><strong>${msg.user}:</strong> ${msg.body}</p>`;
});

clientSocket.on("typing", user => {
  console.log(`typing message from ${user}`);
  feedback.innerHTML = `<p class="feedback">${user} is typing...</p>`;
});
