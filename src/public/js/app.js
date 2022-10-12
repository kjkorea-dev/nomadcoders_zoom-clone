const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;

function showRoom(roomCount) {
  room.hidden = false;
  welcome.hidden = true;
  const h3 = document.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${roomCount})`;
  const messageForm = room.querySelector("#message");
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = messageForm.querySelector("input");
    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You: ${input.value}`);
      input.value = "";
    });
  });
  const nicknameForm = room.querySelector("#nickname");
  nicknameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.emit("nickname", input.value, () => {
      addMessage(`Your nickname is ${input.value} from now!`);
      input.value = "";
    });
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = form.querySelector("input");
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

socket.on("welcome", (user, roomCount) => {
  const h3 = document.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${roomCount})`;
  addMessage(`${user} joined!!!`);
});

socket.on("bye", (user, roomCount) => {
  const h3 = document.querySelector("h3");
  h3.innerText = `Room: ${roomName} (${roomCount})`;
  addMessage(`${user} left...`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) return;
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
