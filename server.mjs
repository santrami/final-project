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
            waitingSocket = socket;
        else {
            let num = "";
            for(let x = 0; x < 20; ++x)
                num += Math.floor(Math.random()*10).toString();
            waitingSocket.join(num);
            socket.join(num);
            const start = (Math.round(Math.random())) ? "X" : "O";
            waitingSocket.to(num).emit("start_tictactoe", {room: num, player: "X", start});
            socket.to(num).emit("start_tictactoe", {room: num, player: "O", start});
            waitingSocket = null;
        }
    });
    socket.on("send_restart_tictactoe", room => io.to(room).emit("restart_tictactoe"));
    socket.on("turn_play", obj => {
        io.to(obj.room).emit("play_turn", {idx: obj.idx, player: obj.player})
    });
});

server.listen(4001, () => console.log("Server initialized on port 4001"));