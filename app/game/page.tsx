"use client";
import { FormEventHandler, useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ChatComponent from "./ChatComponent";

export default function Page() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userChoice, setUserChoice] = useState<string>("");
  const [computerChoice, setComputerChoice] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Data[]>([]);
  const [room, setRoom] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  type Data = {
    user: string;
    message: string;
    room: string;
  };

  const joinRoom = () => {
    if (room !== "") {
      socket?.emit("join-room",  room );
    } 
    console.log(room);
    
  };

  useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("message", (data: Data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);      
    });
    
    socket.on("result", (data) => {
      setComputerChoice(data.opponentChoice);
      setResult(data.result);
      updateScore(data.result);
      console.log(data);
    });


    return () => {
      socket.close();
    };
  }, []);
  
  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);
  
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    socket?.emit("message", { room, message, user: session?.user?.name });
    setMessage("");
    //setRoom("");
  };
  
  const handleUserChoice = (choice: string) => {
    if (gameOver) return;
    //console.log(choice);
    
    setUserChoice(choice);
    socket?.emit("choice", { choice, userId: session?.user?.id });
  };

  
  const updateScore = (result: string) => {
    if (result === "Tú ganas!") {
      setUserScore((prevScore) => prevScore + 1);
    } else if (result === "Computadora gana!") {
      setComputerScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextRound = (): void => {
    if (round < 3) {
      setUserChoice("");
      setComputerChoice("");
      setResult("");
      setRound((prevRound) => prevRound + 1);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = (): void => {
    setGameOver(true);
    if (userScore > computerScore) {
      setWinner("Tú ganas!");
    } else if (userScore < computerScore) {
      setWinner("Computadora gana!");
    } else {
      setWinner("Es un empate!");
    }
  };

  const resetGame = (): void => {
    setUserChoice("");
    setComputerChoice("");
    setResult("");
    setUserScore(0);
    setComputerScore(0);
    setRound(1);
    setGameOver(false);
    setWinner("");
  };

  return (
    <div className="">
      <h1>Piedra, Papel, Tijeras</h1>
      {!gameOver ? (
        <div>
          <h3>Ronda {round}</h3>
          <div>
            <Button
              variant="default"
              onClick={() => handleUserChoice("Piedra")}
            >
              Piedra
            </Button>
            <Button variant="default" onClick={() => handleUserChoice("Papel")}>
              Papel
            </Button>
            <Button
              variant="default"
              onClick={() => handleUserChoice("Tijeras")}
            >
              Tijeras
            </Button>
          </div>
          {result && (
            <div>
              <h2>Tu elección: {userChoice}</h2>
              <h2>Elección de la computadora: {computerChoice}</h2>
              <h2>Resultado: {result}</h2>
              <div className="bg-slate-400">
                <h2>acumulado</h2>
                <h3>Computadora: {computerScore}</h3>
                <h3>Usuario: {userScore}</h3>
              </div>
            </div>
          )}

          {round < 4 && (
            <button onClick={handleNextRound}>Siguiente Ronda</button>
          )}
        </div>
      ) : (
        <div>
          <h2>Game Over!</h2>
          <h3>
            {winner === "Es un empate!"
              ? "Es un empate!"
              : `${winner} Gana el juego!`}
          </h3>
          <button onClick={resetGame}>Jugar de nuevo</button>
        </div>
      )}
      <ChatComponent
        messages={messages}
        session={session}
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
        room={room}
        setRoom={setRoom}
        joinRoom={joinRoom}
      />
      <Button
        variant="destructive"
        onClick={() => signOut({ callbackUrl: "http://localhost:3000" })}
      >
        Sign Out
      </Button>
    </div>
  );
}
