import {createServer} from "http"
import {Server} from "socket.io"

const server = createServer();
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

function generateRandom(digits){
    let num = "";
    for(let x = 0; x < digits; ++x)
        num += Math.floor(Math.random()*10).toString();
    return num;
}

let waitingSocketTTT = null;
let waitingSocketRPS = null;

io.on("connection", socket => {

    console.log("socket connected ", socket.id);


    socket.on("give_room_tictactoe", () => {
        if(waitingSocketTTT === null)
            waitingSocketTTT = socket;
        else {
            let num = generateRandom(20);
            socket.join(num);
            waitingSocketTTT.join(num);
            const start = (Math.round(Math.random())) ? "X" : "O";
            waitingSocketTTT.to(num).emit("start_tictactoe", {room: num, player: "X", start});
            socket.to(num).emit("start_tictactoe", {room: num, player: "O", start});
            waitingSocketTTT = null;
        }
    });

    socket.on("send_restart_tictactoe", room => io.to(room).emit("restart_tictactoe"));
    
    socket.on("turn_play", obj => io.to(obj.room).emit("play_turn", {idx: obj.idx, player: obj.player}));


    //--------------------------------------------------------------------------------------------------------------


    socket.on("give_room_rps", () => {
        if(waitingSocketRPS === null)
                waitingSocketRPS = socket;
        else {
            let num = generateRandom(20);
            waitingSocketRPS.join(num);
            socket.join(num);
            io.to(num).emit("start_rps", {room: num});
            waitingSocketRPS = null;
        }
      });
    
      socket.on("choice_rps", obj => socket.to(obj.room).emit("play_turn_rps", {choice: obj.userChoice}) );
    
      socket.on("s_next_round_rps", obj => socket.to(obj.room).emit("next_round_rps"));

      //-----------------------------------------------------------------------------------

      socket.on("sMessage", obj => socket.to(obj.room).emit("rMessage", {message:obj.message}));

});

server.listen(4001, () => console.log("Server initialized on port 4001"));