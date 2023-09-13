import {createServer} from "http"
import {Server} from "socket.io"

const server = createServer();
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

let waitingSocket = null;

io.on("connection", (socket) => {
    console.log("socket conected", socket.id);
    socket.on("give_room", () => {
        if(waitingSocket === null)
            waitingSocket = socket
        else {
            let num = "";
            for(let x = 0; x < 20; ++x)
                num += Math.floor(Math.random()*10).toString();
            waitingSocket.join(num);
            socket.join(num);
            waitingSocket.to(num).emit("start_tictactoe", {room: num, player: "X"});
            socket.to(num).emit("start_tictactoe", {room: num, player: "O"});
            waitingSocket = null;
        }
    });
    socket.on("send_restart_tictactoe", room => io.to(room).emit("restart_tictactoe"));
});

server.listen(4001, () => console.log("Server initialized on port 4001"));