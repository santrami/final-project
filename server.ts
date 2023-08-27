import { Server } from "socket.io";
import { createServer } from "http";
import { Server as NetServer } from "net";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Or your client's origin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  // Listen for 'choice' event from client
  socket.on("choice", (data) => {
    // Here, data contains the user's choice and the user's id
    const { choice, userId } = data;
    console.log(choice, userId);
    const getResult = (userChoice: string, computerChoice: string): string => {
      
      if (userChoice === computerChoice) {
        return "Es un empate!";
      } else if (
        (userChoice === "Piedra" && computerChoice === "Tijeras") ||
        (userChoice === "Papel" && computerChoice === "Piedra") ||
        (userChoice === "Tijeras" && computerChoice === "Papel")
      ) {
        return "Tu ganas!";
        
      } else {
        return "Computadora gana!";
      }
    };
    
    // Generate computer's choice and result
    const choices = ["Piedra", "Papel", "Tijeras"];
    const randomIndex: number = Math.floor(Math.random() * choices.length);
    const opponentChoice: string = choices[randomIndex];
    const result = getResult(choice, opponentChoice);


    // Emit 'result' event to client
    socket.emit("result", { opponentChoice, result });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// You can choose any port other than your Next.js port
httpServer.listen(4000, () => {
  console.log("Socket.IO server listening on port 4000");
});
