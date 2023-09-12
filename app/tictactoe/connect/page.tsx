import {io} from "socket.io-client"

export default function Connect()
{
  const socket = io("http://localhost:4001");
  socket.on("connection", ()=> console.log("Conected to server"));
  socket.emit("hello from client");
  socket.on("hello from server", (args)=>console.log(`We are on room ${args}`));

  return(
    <h1>Connecting</h1>
  );
}