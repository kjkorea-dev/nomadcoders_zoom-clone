import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key);
  });
  return publicRooms;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
    });
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (message, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${message}`);
    done();
  });
  socket.on("nickname", (nickname, done) => {
    socket["nickname"] = nickname;
    done();
  });
});

/* const wss = new WebSocketServer({ server });
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket["nickname"] = "Anonymous";
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    // socket.send(message.toString());
    // sockets.forEach((aSocket) => aSocket.send(message.toString()));
    switch (message.type) {
      case "new_message":
        sockets.forEach((aSocket) =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
  socket.on("close", () => console.log("Disconnected from the Browser ⛔"));
}); */

httpServer.listen(3000, () =>
  console.log("Listening on http://localhost:3000")
);
