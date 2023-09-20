"use client";
import { FormEventHandler, useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import ChatComponent from "./ChatComponent";
import Image from "next/image";
import { RefreshCw } from "lucide-react";

let socket = io("http://localhost:4005");
let gameRoom = "";

let playerChoice = "";
let rivalChoice = "";
let playerResult = 0;
let rivalNext = false;
let nextBlocked = false;

export default function Page() {
  const { data: session } = useSession();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Data[]>([]);
  const [room, setRoom] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState("");

  const [userChoice, setUserChoice] = useState("");
  const [opponetChoice, setOpponentChoice] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [nextRound, setNextRound] = useState(false);
  const [conState, setConState] = useState(false);
  const [choiceBlocked, setChoiceBlocked] = useState(false);

  useEffect(() => {
    socket.emit("give_room_rps");
  }, []);

  useEffect(() => {
    socket.on("start_rps", obj => {
      gameRoom = obj.room;
      setConState(true);
    });

    socket.on("play_turn_rps", obj =>{
      rivalChoice = obj.choice;
      if(playerChoice !== "")
        roundResult();
    });

    socket.on("next_round_rps", () =>{
      rivalNext = true;
      console.log("receiving", nextBlocked);
      if(nextBlocked)
        goNextRound();
    });
  }, [socket]);

  const handleUserChoice = () => {
    if (userChoice === "" || choiceBlocked) 
      return;
    socket.emit("choice_rps", { userChoice, room: gameRoom });
    playerChoice = userChoice;
    setChoiceBlocked(true);
    if(rivalChoice !== "")
      roundResult();
  };

  function roundResult(){
    setOpponentChoice(rivalChoice);
    if (leftWon(playerChoice, rivalChoice))
    {
      setUserScore(prevScore => prevScore + 1);
      playerResult = 2;
    }
    else if (leftWon(rivalChoice, playerChoice))
    {
      setOpponentScore(prevScore => prevScore + 1);
      playerResult = 0;
    }
    else
      playerResult = 1;
    setNextRound(true);
  }

  function leftWon(left: string, right: string): boolean {
    if(left === "Papel" && right === "Piedra")
      return true;
    if(left === "Piedra" && right === "Tijeras")
      return true;
    if(left === "Tijeras" && right === "Papel")
      return true;
    return false;
  }

  function goNextRound(){
    setNextRound(false);
    setOpponentChoice("");
    setUserChoice("");
    setRound(prev => prev + 1);
    playerChoice = "";
    rivalChoice = "";
    setChoiceBlocked(false);
    rivalNext = false;
    nextBlocked = false;
  }

  return (conState /*&& session*/) ? (
    <div className="flex flex-col">
      <h1 className="text-center mx-auto font-sans text-3xl p-5 bg-slate-200 w-full">
        Piedra, Papel y Tijeras
      </h1>
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
                src={opponetChoice ? `/${opponetChoice}.png` : "/question.png"}
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
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => {if (!choiceBlocked) setUserChoice("Piedra")}}>
              <Image
                className=""
                alt="piedra"
                src="/piedra.png"
                width="100"
                height="100"
              />
            </Button>
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => {if (!choiceBlocked) setUserChoice("Papel")}}>
              <Image
                className=""
                alt="papel"
                src="/papel.png"
                width="100"
                height="100"
              />
            </Button>
            <Button className="hover:bg-transparent hover:scale-125 transition-all" variant="ghost" onClick={() => {if (!choiceBlocked) setUserChoice("Tijeras")}}>
              <Image
                className=""
                alt="tijeras"
                src="/tijeras.png"
                width="100"
                height="100"
              />
            </Button>
            {(!choiceBlocked) && <Button onClick={() => handleUserChoice()}>Send choice {choiceBlocked}</Button>}
            {(nextRound && !nextBlocked) && <Button onClick={() => {
              nextBlocked = true;
              socket.emit("s_next_round_rps", {room: gameRoom});
              console.log("sending", rivalNext);
              if(rivalNext)
                goNextRound();
            }}>Next Round</Button>}
            {nextRound && <p>
              {(playerResult === 0) && "You Lose"}
              {(playerResult === 1) && "Tie"}
              {(playerResult === 2) && "You win"}
              </p>}
          </div>

        </div>
    </div>
  ) : (
  <div className="flex flex-col">
    <p className="self-center text-2xl text-slate-200">Esperando oponente</p>
    <RefreshCw size={30} className="self-center text-7xl text-slate-200 animate-spin" />
  </div>
  );
}
