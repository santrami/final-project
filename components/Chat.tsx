import { type Socket } from "socket.io-client";
import { useState, useEffect, FormEventHandler, useRef } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useSession } from "next-auth/react";
import { MinusSquare } from "lucide-react";
import Message from "./Message";

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
  const { data: session } = useSession();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<msgObjT>>([]);
  const [nameOpponent, setNameOpponent] = useState<string>("");

  const name = session?.user.name;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  useEffect(() => {
    mySocket.on("rMessage", (obj) => {
      setNameOpponent(obj.name);
      setMessages((prev) => {
        const currMessages = prev.slice();
        currMessages.push({ message: obj.message, other: true });
        return currMessages;
      });
    });
  }, [mySocket]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setMessages((prev) => {
      const currMessages = prev.slice();
      currMessages.push({ message: inputMessage, other: false });
      return currMessages;
    });
    setInputMessage("");
    mySocket.emit("sMessage", { room, message: inputMessage, name });
  };

  const minimizeChat = () => {
    const chat = document.querySelector("#chat") as HTMLDivElement;
    chat.style.transition = "all 0.2s cubic-bezier(.95,-.10,.60,.60)";
    if (chat.style.height !== "90vh" && chat.style.width !== "30%") {
      chat.style.height = "90vh"; // Or whatever the original height is
      chat.style.width = "30%";
    } else {
      chat.style.width = "15%";
      chat.style.height = "60px";
    }
  };

  return (
    <div
      id="chat"
      className="absolute flex flex-col bottom-0 right-0 w-[15%] md:w-[15%] sm:w-[15%] bg-slate-800 h-[80px] overflow-hidden"
      style={{background:
        "radial-gradient(black 15%, transparent 16%) 0 0,radial-gradient(black 15%, transparent 16%) 8px 8px,radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px,radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px", backgroundColor:"#282828", backgroundSize:"16px 16px"}}
    >
      <div
        className="flex justify-end h-50 p-5 m-0 bg-slate-950 cursor-pointer text-gray-400"
        onClick={minimizeChat}
      >
        {" "}
        chatea con tu rival
        <MinusSquare className="text-gray-50" />
      </div>
      <ScrollArea className="h-[500px] p-4 overflow-y-scroll break-words">
        {messages.map((obj, id) =>
          obj.other ? (
            <li className="list-none flex justify-end" key={id}>
              <div className="bg-lime-950 inline-flex rounded-full p-3 m-2 text-gray-300 font-sans">
                <span className="flex text-yellow-100 left-auto">
                  {nameOpponent}:
                </span>{" "}
                {obj.message}
              </div>
            </li>
          ) : (
            <li className="list-none" key={id}>
              <div className="bg-slate-950 rounded-xl p-3 m-2 inline-block text-gray-300">
                <span className="text-yellow-100 inline-flex">
                  {session?.user.name}:
                </span>{" "}
                {obj.message}
              </div>
            </li>
          )
        )}
        <div ref={ref} />
      </ScrollArea>
      <Message
        handleSubmit={handleSubmit}
        message={inputMessage}
        setMessage={setInputMessage}
        name={session?.user.name}
      />
    </div>
  );
}
