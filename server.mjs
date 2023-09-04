import {createServer} from "http"
import {Server} from "socket.io"

const server = createServer();
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("socket conected", socket.id);
  
    socket.on("hello from client", ()=> console.log("hi"));
  
    io.emit("hello from server");
  });

server.listen(4001, ()=> console.log("Server initialized on port 4001"));