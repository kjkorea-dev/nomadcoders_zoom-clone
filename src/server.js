import { createServer } from "http";
import { WebSocketServer } from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = createServer(app);

const sockets = [];

const wss = new WebSocketServer({ server });
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
});

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
