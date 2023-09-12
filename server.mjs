import {createServer} from "http"
import {Server} from "socket.io"

const server = createServer();
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
let num = 0;
let roomName = "room 0";

io.on("connection", (socket) => {
    console.log("socket conected", socket.id);
    socket.join(roomName);
    if((++num)%2 === 0)
    {
        //like this it excludes itself to receive the emit and sends to all other members of the room
        //socket.to(`room ${num-2}`).emit("start_tictactoe");
        io.to(`room ${num-2}`).emit("start_tictactoe");
        console.log(`SENDED START GAME!!!! room ${num-2}`);
        roomName = "room " + num;
    }
    socket.on("send_restart_tictactoe", () => {io.to(`room ${num-2}`).emit("restart_tictactoe");});
});

server.listen(4001, ()=> console.log("Server initialized on port 4001"));