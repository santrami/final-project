import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/*httpServer.on("error", (error) => {
  console.error("Server error:", error);
});

//catching erros

io.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

//AAAAAAAAAA
let choices = [];*/

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

});
//  socket.on("join-room", function (data) {
//    socket.join(data);
//    console.log(socket.id, "joined", data);
//  });
//
//  // Listen for message
//  socket.on("message", (data) => {
//    if(data.room !== ""){
//      io.to(data.room).emit("message", data);
//    }else {
//      socket.emit("message", data)
//    }
//  });
//
//  const getResult = function (
//    playerChoice,
//    opponentChoice
//  ) {
//    if (playerChoice === opponentChoice) return "Es un empate!";
//    if (
//      (playerChoice === "Piedra" && opponentChoice === "Tijeras") ||
//      (playerChoice === "Tijeras" && opponentChoice === "Papel") ||
//      (playerChoice === "Papel" && opponentChoice === "Piedra")
//    ) {
//      return "Tú ganas!";
//    }
//    return "Computadora gana!";
//  };
//
//  // Listen for 'choice' event from client
//  socket.on("choice", function (data) {
//    const { choice, userId } = data;
//    //console.log(choice, userId);
//
//    choices.push(choice);
//    console.log(choices);
//    let result = "";
//    
//    if(choices.length > 1){
//      const choice = choices[0];
//      const opponentChoice= choices[1];
//
//       result = getResult(choices[0], choices[1]);
//       //io.emit("result", { opponentChoice, choice, result });
//        socket.emit("result", { opponentChoice, choice, result });
//        choices=[];
//    }else{
//      io.emit("waitingForPlayer", {message: "Esperando a otro jugador"});
//    }
//    /* const choices = ["Piedra", "Papel", "Tijeras"];
//    const randomIndex = Math.floor(Math.random() * choices.length);
//    const opponentChoice = choices[randomIndex]; */
//    
//
//    //console.log(choice);
//
//
//    // Generate computer's choice and result
//    // Emit 'result' event to client
//    
//    
//  });
//
//  socket.on("disconnect", function () {
//    console.log(`User ${socket.id} disconnected`);
//  });
//});
//
// You can choose any port other than your Next.js port
httpServer.listen(4005, () => console.log("Server listening on port 4005"));