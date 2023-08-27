"use strict";
exports.__esModule = true;
var socket_io_1 = require("socket.io");
var http_1 = require("http");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

httpServer.on('error', (error) => {
    console.error('Server error:', error);
  });
  
  io.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });

io.on("connection", function (socket) {
    console.log("User ".concat(socket.id, " connected"));
    // Listen for 'choice' event from client
    socket.on("choice", function (data) {
        //console.log(data);
        // Here, data contains the user's choice and the user's id
        //var choice = data.choice, data.userId = data.userId;
        var {choice, userId}  = data;
        console.log(choice, userId)

        var getResult = function (playerChoice, opponentChoice) {
            if (playerChoice === opponentChoice)
                return 'Es un empate!';
            if ((playerChoice === 'Piedra' && opponentChoice === 'Tijeras') ||
                (playerChoice === 'Tijeras' && opponentChoice === 'Papel') ||
                (playerChoice === 'Papel' && opponentChoice === 'Piedra')) {
                return 'Tú ganas!';
            }
            return 'Computadora gana!';
        };

        var choices = ["Piedra", "Papel", "Tijeras"];
        var randomIndex = Math.floor(Math.random() * choices.length);
        var opponentChoice = choices[randomIndex];
        var result = getResult(choice, opponentChoice);
        // Generate computer's choice and result
        // Emit 'result' event to client
        socket.emit("result", { opponentChoice: opponentChoice, choice:choice, result: result });
    });
    socket.on('disconnect', function () {
        console.log("User ".concat(socket.id, " disconnected"));
    });
});
// You can choose any port other than your Next.js port
httpServer.listen(4000, function () {
    console.log("Socket.IO server listening on port 4000");
});
