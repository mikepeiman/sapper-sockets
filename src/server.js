import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
import {
  storeUsernames,
  storeThisUser,
  storeThisColor,
  storeThisEmoji,
  storeChatRooms,
  storeRoomName,
  storeChatUnderway
} from "./stores.js";
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
let rooms = [];
let room = "";
let i = 0;
let previousClient = false;

storeChatRooms.subscribe(val => {
  console.log(`server.js => storeChatRooms.subscribed, value: `, val);
});

function findIndexByAttr(myArray, prop, val) {
  for (var i = 0, length = myArray.length; i < length; i++) {
    if (myArray[i][prop] == val) {
      return i;
    }
  }
  return -1;
}

function returnObjectByAttr(myArray, prop, val) {
  for (var i = 0, length = myArray.length; i < length; i++) {
    if (myArray[i][prop] == val) {
      return myArray[i];
    }
  }
  return -1;
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
    );
  });
  socket.emit("chatrooms changed", rooms);
  socket.broadcast.emit("chatrooms changed", rooms);

  socket.on("joinRoom", room => {
    console.log(`socket.on joinRoom => count i ${i} room ${room}`, room);
    rooms = [...rooms, room];
    socket.join(room.name);
    socket.broadcast.emit("rooms", rooms);
    socket.emit("rooms", rooms);
  });

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
  socket.on("room name", room => {
    // if (rooms.includes(room)) {
    console.log(`server.js => socket.on("room name"), room ${room} `, room);
    if (rooms.some(r => r.name === room.name)) {
      console.log(`${room.name} chatroom already exists`);
      room.numUsers++;
      let idx = findIndexByAttr(rooms, "name", room.name);
      console.log(
        `${room.name} has numUsers ${room.numUsers} at index ${idx} as in array ${rooms[idx]}`,
        idx,
        rooms[idx]
      );
      rooms[idx] = room;
      rooms = rooms;
      socket.emit("chatrooms changed", rooms);
      socket.broadcast.emit("chatrooms changed", rooms);
    } else {
      console.log(`${room.name} chatroom does not yet exist`);
      rooms = [...rooms, room];
      socket.emit("chatrooms changed", rooms);
      socket.broadcast.emit("chatrooms changed", rooms);
    }
  });

  socket.on("join room", (room, user) => {
    console.log(
      `server => new "join room" event received, calling next updateRooms()`
    );
    updateRooms(room, user, "join");
  });

  function updateRooms(room, user, operation) {
    console.log(`server => updateRooms() ${room.name} from user ${user}`);
    if (typeof room.name !== "undefined") {
      if (operation === "join") {
        console.log(`server => updateRooms("join")`);
        // find room in rooms array
        let idx = findIndexByAttr(rooms, "name", room.name);
        console.log(
          `${room.name} has numUsers ${room.numUsers} at index ${idx} as in array ${rooms[idx]}`,
          idx,
          rooms[idx]
        );
        room.numUsers++;
        console.log(
          `${room.name} has numUsers ${room.numUsers} at index ${idx} as in array ${rooms[idx]}`,
          idx,
          rooms[idx]
        );
        if (idx < 0) {
          console.log(`${room.name} has idx ${idx}`);
          rooms = [...rooms, room];
        } else {
          console.log(`${room.name} has idx ${idx}`, rooms[idx]);
          rooms[idx] = room;
          rooms = rooms;
        }
        socket.join(room.name);

        // socket.emit("chatrooms changed", rooms);
        // socket.broadcast.emit("chatrooms changed", rooms);

        // increment users count in that room
        // add user to the users list
      } else if (operation === "leave") {
        console.log(`server => updateRooms("leave")`);
        // find room in rooms array
        let idx = findIndexByAttr(rooms, "name", room.name);
        socket.leave(room.name);
        console.log(
          `${room.name} has numUsers ${room.numUsers} at index ${idx} as in array ${rooms[idx]}`,
          idx,
          rooms[idx]
        );
        // decrement user count in room
        room.numUsers--;
        console.log(
          `${room.name} has numUsers ${room.numUsers} at index ${idx} as in array ${rooms[idx]}`,
          idx,
          rooms[idx]
        );

        // check if user count < 1, if so, destroy (remove from array) this room
        if (room.numUsers < 1) {
          console.log(
            `the room ${room.name}.numUsers was less than 1, so we will delete it`
          );
          delete rooms[idx];
          console.log(
            `the room.numUsers was less than 1, so we will delete it, will console.dir rooms`,
            room
          );
          rooms = rooms;
          console.dir(rooms);
        } else {
          // remove user from room list
          rooms = rooms;
        }
        // let room = returnObjectByAttr(rooms, "name", roomName)
        if (typeof rooms[0] === "undefined") {
          rooms = [];
        }
      } else if (operation === "update") {
        console.log(`server => updateRooms("update")`);
        // this case is for updates to usernames in room
        // find user by previous name, update to new name
      }
      socket.emit("chatrooms changed", rooms);
      socket.broadcast.emit("chatrooms changed", rooms);
    } else {
      console.log(
        `function updateRooms given an undefined room variable, `,
        room
      );
    }
  }

  socket.on("chat room loaded", (roomName, data, userNameExists) => {
    console.log(
      `server.js => room ${roomName} socket.id ${socket.id} loaded \n   name: ${data.user} \n   emoji ${data.emoji} \n   color ${data.color}`
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

  socket.on("left chatroom", (roomName, userName) => {
    // console.log(
    //   `server.js => receiving an event 'left chatroom' from ${userName} leaving room ${roomName}`
    // );
    // console.log(
    //   `server.js => receiving an event 'left chatroom' all rooms `, rooms
    // );
    let room = returnObjectByAttr(rooms, "name", roomName);
    updateRooms(room, userName, "leave");
    if (typeof rooms[0] === "undefined") {
      rooms = [];
    }
    socket.emit("chatrooms changed", rooms);
    socket.broadcast.emit("chatrooms changed", rooms);
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

  socket.on("typing", (user, room) => {
    console.log(`server.js => on.'typing', user: ${user} room: `, room);
    if (room) {
      console.log(`on"typing" yes we have a room ${room}`);
      // io.sockets.in('/'+room).emit("typing", user);
      io.to(room).emit("typing", user);
    } else {
      console.log(`on"typing" no we have no room ${room}`);
      socket.broadcast.emit("typing", user);
    }
  });

  socket.on("chat message", message => {
    console.log(
      `server.js => on.'message', message: ${message.body} user: ${message.username} room: ${message.room} `,
      room
    );
    if (message.room) {
      console.log(`on"message" yes we have a room ${room}`);
      io.to(room).emit("broadcast message", message);
      // io.sockets.in('/'+room).emit("broadcast message", message);
    } else {
      console.log(`on"message" no we have no room ${room}`);
      socket.broadcast.emit("broadcast message", message);
    }
  });

  socket.on("disconnected", data => {
    console.log(`server.js => client disconnected from chatroom ${room}`);
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
