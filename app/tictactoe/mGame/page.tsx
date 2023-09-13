"use client"
import {io} from "socket.io-client"
import { useState, useEffect } from "react";

const socket = io("http://localhost:4001");
//const socket = io("http://localhost:4001").connect();
let gameRoom = 0;
let player = "";
let blocked = false;

export default function Game()
{
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("");
  const [xWinner, xSetWinner] = useState(false);
  const [oWinner, oSetWinner] = useState(false);

  const [conState, setConState] = useState(false);
  useEffect(() => {
    //events que nomes emitim al principi de tot (no tornar a emetre al reconectar)
    socket.emit("give_room");
  }, []);
  useEffect(() => {

    socket.on("start_tictactoe", obj => {
      gameRoom = obj.room;
      player = obj.player; 
      setConState(true);
      setTurn(obj.start);
     })

    socket.on("restart_tictactoe", () => { restart(); });

    socket.on("play_turn", obj => {
      setTurn( prev => (prev === "X") ? "O" : "X");
      setSquares( prev => {
        const curr = prev.slice();
        curr[obj.idx] = obj.player;
        return curr;
      });
      blocked = false;
    })
  }, [socket]);

  useEffect(() => {
    if(checkWinner(squares, "X"))
      xSetWinner(true);
    else if(checkWinner(squares, "O"))
      oSetWinner(true);
  }, [squares])

  function clickCell(idx:number)
  {
    if(xWinner || oWinner || squares[idx] !== null || turn !== player || blocked)
      return;
    socket.emit("turn_play", {room: gameRoom, idx, player});
    blocked = true;
  }

  function checkWinner(squares:Array<string>, sym: string)
  {
    for(let idx = 0; idx < 9; idx+=3)
      if(squares[idx]===sym && squares[idx+1] === sym && squares[idx+2] === sym)
        return true;
    for(let idx = 0; idx < 9; ++idx)
      if(squares[idx]===sym && squares[idx+3] === sym && squares[idx+6] === sym)
        return true;
    if(squares[0]===sym && squares[4] === sym && squares[8] === sym)
      return true;
    if(squares[2]===sym && squares[4] === sym && squares[6] === sym)
      return true;
  }

  function restart()
  {
    setSquares(Array(9).fill(null));
    xSetWinner(false);
    oSetWinner(false);
  }

  return(
    (conState) ? 
    (<>
      <h1>You are {player}</h1>
      {(!(xWinner || oWinner)) && <p>Its {turn} turn</p>}
      {(xWinner) && <p>X won</p>}
      {(oWinner) && <p>O won</p>}
      <Board squares={squares.slice()} clickCell={clickCell}></Board>
      <button onClick={()=>socket.emit("send_restart_tictactoe", gameRoom)}>Restart</button>
    </>) 
    : <h1>Connecting</h1>
  );
}

function Square({value, click})
{
  return(
    <button className="border-black border-2 w-5 h-5" onClick={click}>{value}</button>
  );
}

function Board({squares, clickCell}) {

  return (
    <div>
      <div>
        <Square value={squares[0]} click={()=>clickCell(0)} />
        <Square value={squares[1]} click={()=>clickCell(1)} />
        <Square value={squares[2]} click={()=>clickCell(2)} />
      </div>
      <div>
        <Square value={squares[3]} click={()=>clickCell(3)} />
        <Square value={squares[4]} click={()=>clickCell(4)} />
        <Square value={squares[5]} click={()=>clickCell(5)} />
      </div>
      <div>
        <Square value={squares[6]} click={()=>clickCell(6)} />
        <Square value={squares[7]} click={()=>clickCell(7)} />
        <Square value={squares[8]} click={()=>clickCell(8)} />
      </div>
    </div>
  );
}
