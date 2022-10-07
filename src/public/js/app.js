const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;

function showRoom() {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = document.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = form.querySelector("input[type=text]");
  roomName = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
});

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

socket.on("welcome", () => {
  addMessage("Someone joined!!!");
});

socket.on("bye", () => {
  addMessage("Someone left...");
});
