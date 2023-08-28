"use client";

import { useEffect, useState } from "react";
import {signOut} from "next-auth/react";
import { Button } from "@/components/ui/button";

const choices = ["Piedra", "Papel", "Tijeras"];

export default function Page() {
  const [userChoice, setUserChoice] = useState<string>("");
  const [computerChoice, setComputerChoice] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [userScore, setUserScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    updateScore(result);
  }, [result]);

  const handleUserChoice = (choice: string): void => {
    if (gameOver) return;

    const randomIndex: number = Math.floor(Math.random() * choices.length);
    const computerChoice: string = choices[randomIndex];

    setUserChoice(choice);
    setComputerChoice(computerChoice);
    setResult(getResult(choice, computerChoice));
    console.log(result);
    
    
  };
  // get result of round

  // create a socket.io connection
  
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

  const updateScore = (result: string) => {
    if (result === "Tu ganas!") {
      setUserScore((prevScore) => prevScore + 1);
      return "Tu ganas";
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
      console.log(gameOver);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = (): void => {
    setGameOver(true);
    console.log(gameOver);
    if (userScore > computerScore) {
      setWinner("Tú");
    } else if (userScore < computerScore) {
      setWinner("Computadora");
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
    <div>
      <h1>Piedra, Papel, Tijeras</h1>
      {!gameOver ? (
        <div>
          <h3>Ronda {round}</h3>
          <div>
            <button onClick={() => handleUserChoice("Piedra")}>Piedra </button>
            <button onClick={() => handleUserChoice("Papel")}>Papel </button>
            <button onClick={() => handleUserChoice("Tijeras")}> Tijeras</button>
          </div>
          {userChoice && computerChoice && result && (
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
          <h3>{winner ==="Es un empate!" ? "Es un empate!": `${winner} Gana el juego!`}</h3>
          <button onClick={resetGame}>Jugar de nuevo</button>
        </div>
      )}
      <Button variant="destructive" onClick={() => signOut({callbackUrl:'http://localhost:3000'})}>Sign Out</Button>
    </div>
  );
}
