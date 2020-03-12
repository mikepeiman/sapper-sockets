import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";
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

io.on("connection", socket => {
  console.log(`serverSockets: made socket connection `, socket.id);
});
