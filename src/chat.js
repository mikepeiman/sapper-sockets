const clientSocket = io.connect(window.origin);

let output = document.querySelector("#output"),
  username = document.querySelector("#username"),
  submit = document.querySelector("#send-message"),
  message = document.querySelector("#message");

// emit event
submit.addEventListener('click', () => {
  let msg = {
    body: message.value,
    user: username.value
  }
  clientSocket.emit('new message', msg)
})

// listen for events

clientSocket.on('chat', msg => {
  console.log(`client ${clientSocket.id} has received a chat msg of ${msg.body} from ${msg.user}`)
  output.innerHTML += `<p><strong>${msg.user}:</strong> ${msg.body}</p>`
})