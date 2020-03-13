import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const NetworkAvatarPicker = require("network-avatar-picker");
const avatarPicker = new NetworkAvatarPicker();

const serverSocket = require("socket.io");
const http = require("http");
const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const server = http.createServer();
const app = polka({ server });
app.listen(PORT, err => {
  console.log(`server listening on port ${PORT}`);
  if (err) console.log("error", err);
});
app.use(
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware()
);

const io = serverSocket(server);
// using this great, succinct tutorial to learn socket.io:
// https://www.youtube.com/watch?v=KNqVpESuyQo&list=PL4cUxeGkcC9i4V-_ZVwLmOusj8YAUhj_9&index=4

io.on("connection", socket => {
  // socket.join('chatlobby')
  console.log(`serverSockets: made socket connection `, socket.id);
  // socket.on("new message", msg => {
  //   console.log(
  //     `Server received new message  ${msg.body} from client user ${msg.user} with socket id ${socket.id}`
  //   );
  //   io.sockets.emit("chat", msg);
  // });

  socket.on("typing", username => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("message", message => {
    socket.broadcast.emit("message", message);
  });

  socket.on("avatar init", () => {
    (async () => {
      try {
        const res = await avatarPicker.twitter.getAvatar('mikepeiman');
        console.log(`inside server socket.on avatar init, res `, res)
        const b64 = new Buffer.from(res).toString('base64')
        const mimeType = 'image/png'
        const src = `data:${mimeType};base64,${b64}`
        socket.emit('avatar returned', src)
      } catch (e) {
        // Deal with the fact the chain failed
        console.log(`inside server socket.on avatar init, failed `, e)
      }
  })();
    (async () => {
      try {
        const res = await avatarPicker.facebook.getAvatarUrl("mikepeiman");
        console.log(`inside server socket.on avatar init, res `, res)
      } catch (e) {
        // Deal with the fact the chain failed
        console.log(`inside server socket.on avatar init, failed `, e)
      }
    })();

    // socket.emit("avatar returned", true);
  });
});
