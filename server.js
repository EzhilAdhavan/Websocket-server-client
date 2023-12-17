const app = require("http").createServer((req, res) => {
    res.writeHead(500);
    res.end("failed");
  });
  const server = app.listen(3000);
  const io = require("socket.io")(server);
  
  const sockets = {};
  
  io.on("connection", (socket) => {
    sockets[socket.id] = socket;
    console.log(`Client Connected! id: ${socket.id}`);
    socket.emit("message", "Thank you");
  
    socket.on("message", (message) => {
      console.log(`Client: ${message}`);
    });
  
    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected.`);
      delete sockets[socket.id];
    });
  });
  
  process.stdin.on("data", (buf) => {
    for (id in sockets) {
      sockets[id].emit("message", String(buf));
    }
  });
  