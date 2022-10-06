const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function backendDone(msg) {
  console.log(`The backend says: ${msg}`);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = form.querySelector("input[type=text]");
  socket.emit("enter_room", input.value, backendDone);
  input.value = "";
});
