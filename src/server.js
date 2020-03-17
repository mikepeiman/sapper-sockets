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
let rooms = [
  { name: "roomname1", numUsers: 1 },
  { name: "roomname2", numUsers: 2 }
];
let room = "";
let i = 0;
let previousClient = false;

function getElByPropVal(myArray, prop, val) {
  for (var i = 0, length = myArray.length; i < length; i++) {
    if (myArray[i][prop] == val) {
      return myArray[i];
    }
  }
}
// io.use((socket, next) => {
//   if (socket.request.headers.cookie) {
//     console.log(`io.use((socket, next) => {
//       if (socket.request.headers.cookie) ${socket.request.headers.cookie} socket.handshake.headers.cookie  ${socket.handshake.headers.cookie}`);
//     return next();
//   }
//   next(new Error("Authentication error"));
// });

// using this great, succinct tutorial to learn socket.io:
// https://www.youtube.com/watch?v=KNqVpESuyQo&list=PL4cUxeGkcC9i4V-_ZVwLmOusj8YAUhj_9&index=4

io.sockets.on("connection", socket => {
  io.clients((error, clients) => {
    if (error) throw error;
    console.log(
      `\n******************************\nclients ${clients} number of ${clients.length}\n******************************\n`
    ); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
  });
  socket.emit("rooms", rooms);
  let cookie = socket.handshake.headers.cookie;
  cookie = cookie.slice(cookie.indexOf("=") + 1);
  // socket.join('chatlobby')
  console.log(`serverSockets: made socket connection ${i}: `, socket.id);

  let el = users.find(user => user.socket === cookie) || "not found";
  // let match = users.find(x => x.id === socket.id).id === socket.id
  console.log(
    `\nis there a cookie ${cookie} match with a previous socket.id? client name ${
      el.name ? el.name : el
    }`
  );
  console.dir(el, `\n\n`);

  // var cookies = cookieParser(socket.handshake.headers.cookie);
  console.log(`socket.handshake.headers.cookie ${cookie}`);
  socket.on("joinRoom", room => {
    // if (rooms.includes(room)) {
    socket.join(room);
    return socket.emit("success", `Success! Joined ${room}`);
    // } else {
    // return socket.emit(
    //   "error",
    //   `ERROR: No room by that name ___${room}___ found`
    // );
    // }
  });

  socket.on("client loaded", (data, userNameExists) => {
    console.log(
      `client ${socket.id} loaded \n   name: ${data.user} \n   emoji ${data.emoji} \n   color ${data.color}`
    );
    i++;

    if (el.id === cookie) {
      console.log(
        `\nWe have a cookie-id match. current users array: `,
        users,
        `\n`
      );
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
      let pos = users
        .map(function(e) {
          return e.socket;
        })
        .indexOf(socket.id);
      console.log(`Found user object position ${pos} in users `, users[pos]);
      usernames.splice(usernames.indexOf(socket.username), 1);
      socket.broadcast.emit(
        "usernames after splicing out the disconnect",
        usernames
      );
    }
    io.clients((error, clients) => {
      if (error) throw error;
      console.log(
        `\n******************************\nclients ${clients}\n******************************\n`
      ); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
    });
  });
});
