import { type Socket } from "socket.io-client";
import { useState, useEffect } from "react";

type msgObjT = {
  message: string;
  other: boolean;
};

export default function Chat({
  mySocket,
  room,
}: {
  mySocket: Socket;
  room: string;
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<msgObjT>>([]);

  useEffect(() => {
    mySocket.on("rMessage", (obj) => {
      setMessages((prev) => {
        const currMessages = prev.slice();
        currMessages.push({ message: obj.message, other: true });
        return currMessages;
      });
    });
  }, [mySocket]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMessages((prev) => {
          const currMessages = prev.slice();
          currMessages.push({ message: inputMessage, other: false });
          return currMessages;
        });
        setInputMessage("");
        mySocket.emit("sMessage", { room, message: inputMessage });
      }}
    >
      <input
        type="text"
        placeholder="Message..."
        maxLength={50}
        onChange={(e) => setInputMessage(e.target.value)}
        value={inputMessage}
      />
      <button type="submit" className="text-neutral-100">
        Send
      </button>
      <p className="text-neutral-100">Messages: </p>
      <ul className="overflow-y-scroll max-h-96">
        {messages.map((obj, id) =>
          obj.other ? (
            <li key={id} className="text-red-300">
              {obj.message}
            </li>
          ) : (
            <li key={id} className="text-green-300">
              {obj.message}
            </li>
          )
        )}
      </ul>
    </form>
  );
}
