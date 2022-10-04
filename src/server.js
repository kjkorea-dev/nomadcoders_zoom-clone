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
const wss = new WebSocketServer({ server });
wss.on("connection", (socket) => console.log(socket));

server.listen(3000, () => console.log("Listening on http://localhost:3000"));
