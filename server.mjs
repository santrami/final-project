import {createServer} from "http"
import {Server} from "socket.io"

const server = createServer();
const io = new Server(server);
let num = 0;
let roomName = "room 0";

io.on("connection", (socket) => {
    console.log("socket conected", socket.id);
  
    ++num;
    if(num%2 === 0)
      roomName = "room " + num;
    socket.join(roomName);
    socket.on("hello from client", ()=> console.log(`client ${socket.id} says hi`));
  
    //broadcast
    io.emit("hello from server");
    socket.to(roomName).emit("hello from server", roomName);
});

server.listen(4001, ()=> console.log("Server initialized on port 4001"));