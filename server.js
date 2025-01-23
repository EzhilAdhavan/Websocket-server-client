const http = require("http");
const readline = require("readline");
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Server is running");
});

const io = require("socket.io")(server);
const PORT = 3000;

const clients = {};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("A client is trying to connect...");
  socket.on("join", (name) => {
    clients[name] = socket;
    socket.clientName = name;
    console.log(`${name} has joined!`);
    socket.emit("message", `Welcome ${name}! You are now connected.`);

    for (const [clientName, clientSocket] of Object.entries(clients)) {
      if (clientSocket !== socket) {
        clientSocket.emit("message", `${name} has joined the chat.`);
      }
    }
  });

  socket.on("message", (message) => {
    console.log(`Message from ${socket.clientName}: ${message}`);

    for (const [clientName, clientSocket] of Object.entries(clients)) {
      if (clientSocket !== socket) {
        clientSocket.emit("message", `${socket.clientName}: ${message}`);
      }
    }
  });

  socket.on("disconnect", () => {
    if (socket.clientName) {
      console.log(`${socket.clientName} has disconnected.`);
      delete clients[socket.clientName];

      for (const [clientName, clientSocket] of Object.entries(clients)) {
        clientSocket.emit("message", `${socket.clientName} has left the chat.`);
      }
    }
  });
});

rl.on("line", (input) => {
  if (input.trim() === "quit") {
    console.log("Disconnecting...");
    for (const [clientName, clientSocket] of Object.entries(clients)) {
      clientSocket.emit("message", "Server is shutting down. You will be disconnected.");
      clientSocket.disconnect(true);
      console.log(`${clientName} has disconnected...❌`);
    }

    server.close(() => {
      console.log("Server closed.");
      process.exit();
    });
  }
});