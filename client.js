const io = require("socket.io-client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter your name: ", (name) => {
  const socket = io.connect("http://localhost:3000", { reconnect: true });

  socket.on("connect", () => {
    console.log(`Connected to the server as ${name}`);
    socket.emit("join", name);
  });

  socket.on("message", (message) => {
    console.log(`Server: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected from the server`);
    process.exit();
  });

  rl.on("line", (input) => {
    if (input.trim() === "quit") {
      console.log("Disconnecting...");
      socket.disconnect();
      rl.close();
      process.exit();
    }
    socket.emit("message", input);
  });
});
