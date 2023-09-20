"use client";
import { FormEventHandler, useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ChatComponent from "./ChatComponent";
import Image from "next/image";

export default function Page() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userChoice, setUserChoice] = useState<string>("");
  const [oponnetChoice, setOponnetChoice] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
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
      socket?.emit("join-room", room);
    }
    console.log(room);
  };

  useEffect(() => {
    const socket = io("http://localhost:4000");
    setSocket(socket);

    //testing socket connection
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("waitingForPlayer", (data) => {
      console.log(data);
      
    });
    socket.on("message", (data: Data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on("result", (data) => {
      //setOponnetChoice(data.opponentChoice);
      setUserChoice(data.choice);
      setOponnetChoice(data.opponentChoice);
      setResult(data.result);
      updateScore(data.result);
      console.log(data);
    });

    socket.on("choiceUser", (data)=>{
      setUserChoice(data);
    });
    
    socket.on("opponentChoice", (data) =>{
      setOponnetChoice(data);
    })

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

/*   const handleUser2Choice = (choice: string) => {
    if (gameOver) return;
    //console.log(choice);

    setOponnetChoice(choice);
    socket?.emit("choice", { choice, userId: session?.user?.id });
  }; */

  const updateScore = (result: string) => {
    if (result === "Tú ganas!") {
      setUserScore((prevScore) => prevScore + 1);
    } else if (result === "Computadora gana!") {
      setOpponentScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextRound = (): void => {
    if (round < 3) {
      setUserChoice("");
      setOponnetChoice("");
      setResult("");
      setRound((prevRound) => prevRound + 1);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = (): void => {
    setGameOver(true);
    if (userScore > opponentScore) {
      setWinner("Tú ganas!");
    } else if (userScore < opponentScore) {
      setWinner("Computadora gana!");
    } else {
      setWinner("Es un empate!");
    }
  };

  const resetGame = (): void => {
    setUserChoice("");
    setOponnetChoice("");
    setResult("");
    setUserScore(0);
    setOpponentScore(0);
    setRound(1);
    setGameOver(false);
    setWinner("");
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center mx-auto font-sans text-3xl p-5 bg-slate-200 w-full">
        Piedra, Papel y Tijeras
      </h1>
      {!gameOver ? (
        <div className="container bg-slate-400">
          <div className="flex justify-evenly">
            <div className="">
              <p>yo</p>
              <Image
                className=""
                priority 
                alt="election"
                src={userChoice ? `/${userChoice}.png` : "/question.png"}
                width="200"
                height="300"
              />
              <div>puntaje: {userScore}</div>
            </div>
            <div>
              <p>rival</p>
              <Image
                className=""
                priority 
                alt="election"
                src={oponnetChoice ? `/${oponnetChoice}.png` : "/question.png"}
                width="200"
                height="300"
              />
              <div>puntaje: {opponentScore}</div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-slate-800 rounded-lg py-5 px-3 my-6 text-zinc-400">
              Ronda {round}
            </div>
          </div>
          <div className="">Haz tu elección</div>
          <div className="flex items-center justify-center gap-9">
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => handleUserChoice("Piedra")}>
              <Image
                className=""
                alt="piedra"
                src="/piedra.png"
                width="100"
                height="100"
              />
            </Button>
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => handleUserChoice("Papel")}>
              <Image
                className=""
                alt="papel"
                src="/papel.png"
                width="100"
                height="100"
              />
            </Button>
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => handleUserChoice("Tijeras")}>
              <Image
                className=""
                alt="tijeras"
                src="/tijeras.png"
                width="100"
                height="100"
              />
            </Button>
          </div>
          {result && (
            <div>
              <h2>Tu elección: {userChoice}</h2>
              <h2>Elección de la computadora: {oponnetChoice}</h2>
              <h2>Resultado: {result}</h2>
              <div className="bg-slate-400">
                <h2>acumulado</h2>
                <h3>Computadora: {opponentScore}</h3>
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
    </div>
  );
}
