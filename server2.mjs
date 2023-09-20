import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let waitingSocket = null;
io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("give_room_rps", () => {
    if(waitingSocket === null)
            waitingSocket = socket;
    else {
        let num = "";
        for(let x = 0; x < 20; ++x)
            num += Math.floor(Math.random()*10).toString();
        waitingSocket.join(num);
        socket.join(num);
        io.to(num).emit("start_rps", {room: num});
        waitingSocket = null;
    }
  });

  socket.on("choice_rps", obj =>{
    socket.to(obj.room).emit("play_turn_rps", {choice: obj.userChoice});
  });

  socket.on("s_next_round_rps", obj => socket.to(obj.room).emit("next_round_rps"));

});

httpServer.listen(4005, () => console.log("Server listening on port 4005"));