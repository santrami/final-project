"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
httpServer.on("error", function (error) {
    console.error("Server error:", error);
});
//catching erros
io.on("connect_error", function (error) {
    console.error("Connection error:", error);
});
// Listen for new connections
//SOCKET IO ON CONNECTION
io.on("connection", function (socket) {
    console.log("User ".concat(socket.id, " connected"));
    socket.on("join-room", function (data) {
        socket.join(data);
        console.log(socket.id, "joined", data);
    });
    // Listen for message
    socket.on("message", function (data) {
        if (data.room !== "") {
            io.to(data.room).emit("message", data);
        }
        else {
            socket.emit("message", data);
        }
    });
    // Listen for 'choice' event from client
    socket.on("choice", function (data) {
        var choice = data.choice, userId = data.userId;
        console.log(choice, userId);
        var getResult = function (playerChoice, opponentChoice) {
            if (playerChoice === opponentChoice)
                return "Es un empate!";
            if ((playerChoice === "Piedra" && opponentChoice === "Tijeras") ||
                (playerChoice === "Tijeras" && opponentChoice === "Papel") ||
                (playerChoice === "Papel" && opponentChoice === "Piedra")) {
                return "Tú ganas!";
            }
            return "Computadora gana!";
        };
        var choices = ["Piedra", "Papel", "Tijeras"];
        var randomIndex = Math.floor(Math.random() * choices.length);
        var opponentChoice = choices[randomIndex];
        var result = getResult(choice, opponentChoice);
        // Generate computer's choice and result
        // Emit 'result' event to client
        socket.emit("result", { opponentChoice: opponentChoice, choice: choice, result: result });
    });
    socket.on("disconnect", function () {
        console.log("User ".concat(socket.id, " disconnected"));
    });
});
// You can choose any port other than your Next.js port
httpServer.listen(4000, function () {
    console.log("Socket.IO server listening on port 4000");
});
