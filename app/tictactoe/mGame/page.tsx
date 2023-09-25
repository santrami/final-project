"use client";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Cuprum } from "next/font/google";

const socket = io("http://localhost:4001");
let gameRoom = "";
let player = "";
let blocked = false;

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("");
  const [xWinner, xSetWinner] = useState(false);
  const [oWinner, oSetWinner] = useState(false);
  const { data: session } = useSession();

  const [conState, setConState] = useState(false);

  useEffect(() => {
    socket.emit("give_room_tictactoe");
  }, []);

  useEffect(() => {
    socket.on("start_tictactoe", obj => {
      gameRoom = obj.room;
      player = obj.player;
      setConState(true);
      setTurn(obj.start);
    });

    socket.on("restart_tictactoe", () => {
      restart();
    });

    socket.on("play_turn", (obj) => {
      setTurn((prev) => (prev === "X" ? "O" : "X"));
      setSquares((prev) => {
        const curr = prev.slice();
        curr[obj.idx] = obj.player;
        return curr;
      });
      blocked = false;
    });
  }, [socket]);

  useEffect(() => {
    if (checkWinner(squares, "X")) xSetWinner(true);
    else if (checkWinner(squares, "O")) oSetWinner(true);
  }, [squares]);

  function clickCell(idx: number) {
    if (
      xWinner ||
      oWinner ||
      squares[idx] !== null ||
      turn !== player ||
      blocked
    )
      return;
    socket.emit("turn_play", { room: gameRoom, idx, player });
    blocked = true;
  }

  function checkWinner(squares: Array<string>, sym: string) {
    for (let idx = 0; idx < 9; idx += 3)
      if (
        squares[idx] === sym &&
        squares[idx + 1] === sym &&
        squares[idx + 2] === sym
      )
        return true;
    for (let idx = 0; idx < 9; ++idx)
      if (
        squares[idx] === sym &&
        squares[idx + 3] === sym &&
        squares[idx + 6] === sym
      )
        return true;
    if (squares[0] === sym && squares[4] === sym && squares[8] === sym)
      return true;
    if (squares[2] === sym && squares[4] === sym && squares[6] === sym)
      return true;
  }

  function restart() {
    setSquares(Array(9).fill(null));
    xSetWinner(false);
    oSetWinner(false);
  }

return conState /*&& session*/ ? (
    <div className="flex flex-col">
      <Chat mySocket={socket}/>
      {!(xWinner || oWinner) && (
        <p className="self-center text-gray-50 text-2xl mb-5">
          Es el turno de {session?.user.name} ({turn})
        </p>
      )}
      {xWinner && (
        <div className="flex flex-col">
          <p className="self-center text-3xl text-neutral-100">{/*session.user.name*/} (X) gana</p>{" "}
          <Button
            variant="default"
            className="self-center text-2xl"
            onClick={() => socket.emit("send_restart_tictactoe", gameRoom)}
          >
            Restart
          </Button>{" "}
        </div>
      )}
      {oWinner && (
        <div className="flex flex-col">
          {" "}
          <p className="self-center text-3xl text-neutral-100">{/*session.user.name*/} (O) gana</p>{" "}
          <Button
            variant="default"
            className="self-center text-2xl"
            onClick={() => socket.emit("send_restart_tictactoe", gameRoom)}
          >
            Restart
          </Button>{" "}
        </div>
      )}
      <Board squares={squares.slice()} clickCell={clickCell}></Board>
      <h1 className="flex text-4xl self-center text-gray-300 p-2">
        Tú eres {player}
      </h1>
    </div>
  ) : (
    <div className="flex flex-col">
      <p className="self-center text-2xl text-slate-200">Esperando oponente</p>
      <RefreshCw size={30} className="self-center text-7xl text-slate-200 animate-spin" />
    </div>
  );
}

type SquareProps = {
  value: string;
  click: () => void;
};

function Square({ value, click }: SquareProps) {
  return (
    <button
      className="w-28 h-28 hover:bg-slate-500 text-6xl font-semibold bg-white"
      onClick={click}
    >
      {value}
    </button>
  );
}

type BoardProps = {
  squares: Array<string>;
  clickCell: (idx: number) => void;
};

function Board({ squares, clickCell }: BoardProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <div className="flex gap-1">
        <Square value={squares[0]} click={() => clickCell(0)} />
        <Square value={squares[1]} click={() => clickCell(1)} />
        <Square value={squares[2]} click={() => clickCell(2)} />
      </div>
      <div className="flex gap-1">
        <Square value={squares[3]} click={() => clickCell(3)} />
        <Square value={squares[4]} click={() => clickCell(4)} />
        <Square value={squares[5]} click={() => clickCell(5)} />
      </div>
      <div className="flex gap-1">
        <Square value={squares[6]} click={() => clickCell(6)} />
        <Square value={squares[7]} click={() => clickCell(7)} />
        <Square value={squares[8]} click={() => clickCell(8)} />
      </div>
    </div>
  );
}


function Chat({mySocket}) {
  const inputMessage = useRef("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("rMessage", obj => { 
      setMessages(prev => {
        const currMessages = prev.slice();
        currMessages.push({message:obj.message, other:true});
        return currMessages;
      })
    })
  }, [mySocket]);

  return (
    <form onSubmit={ e =>{
      e.preventDefault();
      setMessages(prev => {
        const currMessages = prev.slice();
        currMessages.push({message:inputMessage.current, other:false});
        return currMessages;
      })
      mySocket.emit("sMessage", {room:gameRoom, message:inputMessage.current});
    }}>
      <input type="text" placeholder="Message..."
      onChange={ event =>inputMessage.current = event.target.value }>
      </input>
      <button type="submit" className="text-neutral-100">Send</button>
      <p className="text-neutral-100">Messages: </p>
      <ul>
        {messages.map( (obj, id) => (obj.other) ? <li key={id} className="text-red-300">{obj.message}</li> : <li key={id} className="text-green-300">{obj.message}</li>)}
      </ul>
    </form>
  );
}