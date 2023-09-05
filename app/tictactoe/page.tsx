"use client";

import { useState } from "react";

export default function Page(){
  const [state, setState] = useState(0);
  return(
    <>
      {state === 0 && <Choice setStateFunc={setState}></Choice> }
      {state === 1 && <Game/>}
    </>
  );
}

function Choice({setStateFunc})
{
  return(
    <>
      <div>
        <button onClick={()=>setStateFunc(1)}>Single Player</button>
      </div>
      <div>
        <button onClick={()=>setStateFunc(2)}>Multi Player</button>
      </div>
    </>
  );
}

function Game()
{
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xTurn, setTurn] = useState(false);
  const [xWinner, xSetWinner] = useState(false);
  const [oWinner, oSetWinner] = useState(false);

  function clickCell(idx:number)
  {
    if(xWinner || oWinner)
      return;
    const currSquares = squares.slice();
    (xTurn) ? currSquares[idx] = "X" : currSquares[idx] = "O";
    if (currSquares[idx] !== squares[idx])
    {
      setTurn((prev)=> !prev);
      setSquares(currSquares);
      if(checkWinner(currSquares, "X"))
        xSetWinner(true);
      else if(checkWinner(currSquares, "O"))
        oSetWinner(true);
    }
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
    <>
      {(!(xWinner || oWinner)) && <p>Its {(xTurn)? 'X': 'O'} turn</p>}
      {(xWinner) && <p>X won</p>}
      {(oWinner) && <p>O won</p>}
      <Board squares={squares.slice()} clickCell={clickCell}></Board>
      <button onClick={restart}>Restart</button>
    </>
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
