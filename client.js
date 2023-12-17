var io = require("socket.io-client");
var socket = io.connect("http://localhost:3000", { reconnect: true });

// Add a connect listener
socket.on("connect", function (socket) {
  console.log(`Connected!`);
});

socket.on("message", (message) => {
  console.log(`Server: ${message}`);
});

process.stdin.on("data", (buf) => {
  if (String(buf) == "quit\n") {
    console.log(`${socket.id} disconnecting..`);
    socket.disconnect();
  }
  socket.emit("message", String(buf));
});
