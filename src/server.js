import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
const cookieParser = require("cookie-parser");
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
  sapper.middleware(),
  cookieParser()
);

const io = new serverSocket(server);
let users = [];
let usernames = [];
let i = 0;
let previousClient = false;

function getElByPropVal(myArray, prop, val) {
  for (var i = 0, length = myArray.length; i < length; i++) {
    if (myArray[i][prop] == val) {
      return myArray[i];
    }
  }
}

// using this great, succinct tutorial to learn socket.io:
// https://www.youtube.com/watch?v=KNqVpESuyQo&list=PL4cUxeGkcC9i4V-_ZVwLmOusj8YAUhj_9&index=4

io.sockets.on("connection", socket => {

  let cookie = socket.handshake.headers.cookie;
  cookie = cookie.slice(cookie.indexOf("=") + 1);
  // socket.join('chatlobby')
  console.log(`serverSockets: made socket connection ${i}: `, socket.id);

  let el = users.find(user => user.socket === cookie) || "not found";
  // let match = users.find(x => x.id === socket.id).id === socket.id
  console.log(
    `\nis there a cookie ${cookie} match with a previous socket.id? client name ${el.name ? el.name : el}`
  );
  console.dir(el,`\n\n`)

  // var cookies = cookieParser(socket.handshake.headers.cookie);
  console.log(`socket.handshake.headers.cookie ${cookie}`);
  // socket.on("new message", msg => {
  //   console.log(
  //     `Server received new message  ${msg.body} from client user ${msg.user} with socket id ${socket.id}`
  //   );
  //   io.sockets.emit("chat", msg);
  // });

  socket.on("client loaded", (data, userNameExists) => {
    console.log(
      `client ${socket.id} loaded \n   name: ${data.user} \n   emoji ${data.emoji} \n   color ${data.color}`
    );
    i++

    if(el.id === cookie){
      console.log(`\nWe have a cookie-id match. current users array: `, users, `\n`);
      socket.broadcast.emit("usernames", usernames);
      socket.emit("usernames", usernames);
    } else {
      if (usernames.indexOf(data.user !== -1)) {
        let name = data.user;
        console.log(`username ${name} is valid due to unique`);
  
        socket.username = name;
        console.log(
          `now logging socket.username immediately following assignment ${socket.username}`
        );
        usernames = [...usernames, data.user];
        users = [
          ...users,
          {
            id: i,
            name: name,
            socket: socket.id,
            cookie: cookie
          }
        ];
        socket.broadcast.emit("usernames", usernames);
        socket.emit("usernames", usernames);
        userNameExists(false);
      } else {
        console.log(`username ${data.user} not valid due to duplicate`);
        userNameExists(true);
      }
    }
    socket.broadcast.emit("users", users);
    socket.emit("users", users);
    console.log(`\ncurrent users array: `, users, `\n`);
  });

  socket.on("update username", name => {
    console.log(
      `server asked to update username with ${name}, names: `,
      usernames
    );
    usernames.splice(usernames.indexOf(socket.username), 1);
    usernames = [...usernames, name];
    socket.username = name;
    socket.broadcast.emit("usernames", usernames);
    socket.emit("usernames", usernames);
    console.log(
      `server asked to update username AFTER: with ${name}, names: `,
      usernames
    );
  });

  socket.on("typing", username => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("message", message => {
    socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", reason => {
    console.log(
      `received a server-side socket disconnect, reason given: `,
      reason
    );
    if (reason === "transport close") {
      console.log(`transport close given reason, socket.open `, socket.open);
      socket.open;
    }

    if (!socket.username) {
      console.log(`no socket.username set here!`);
    } else {
      console.log(
        `\ndisconnecting socket.username ${socket.username} with cookie ${cookie} and socket.id ${socket.id}\n`
      );
      let pos = users.map(function(e) { return e.socket; }).indexOf(socket.id);
      console.log(`Found user object position ${pos} in users `, users[pos])
      usernames.splice(usernames.indexOf(socket.username), 1);
      socket.broadcast.emit("usernames after splicing out the disconnect", usernames);
    }
  });

});
