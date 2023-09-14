import { MinusSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Chat from "./Message";
import { Dispatch, useEffect, useRef } from "react";
import { Session } from "next-auth";

type Data = {
  user: string;
  message: string;
  room: string;
};

type ChatProps = {
  session: Session | null;
  messages: Data[];
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  message: string;
  setMessage: Dispatch<React.SetStateAction<string>>;
  setRoom: Dispatch<React.SetStateAction<string>>;
  room:string;
  joinRoom: () => void;
}

function ChatComponent({ messages, session, message, room, joinRoom, setRoom, handleSubmit, setMessage }: ChatProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length]);

  const minimizeChat = () => {
    const chat = document.querySelector("#chat") as HTMLDivElement;
    chat.style.transition = "all 0.2s cubic-bezier(.95,-.10,.60,.60)";
    if (chat.style.height !== "80px" && chat.style.width !== "15%") {
      chat.style.width = "15%";
      chat.style.height = "80px";
    } else {
      chat.style.height = "90vh"; // Or whatever the original height is
      chat.style.width = "50%";
    }
  };

  return (
    <div
      id="chat"
      className="fixed bottom-2 right-4 w-1/3 md:w-1/2 sm:w-4/5 bg-slate-800 overflow-hidden h-[90vh]"
    >
      <div
        className="flex justify-end h-50 p-5 m-0 bg-slate-950 cursor-pointer"
        onClick={minimizeChat}
      >
        <MinusSquare className="text-gray-50" />
      </div>
      <ScrollArea className="h-[500px] p-4">
        {messages.map((data, index) =>
          session!.user.name === data.user ? (
            <li className="list-none flex justify-end" key={index}>
              <div className="bg-lime-950 inline-flex rounded-full p-3 m-2 text-gray-300 font-sans">
                <span className="flex text-yellow-100 left-auto">
                  {data.user}
                </span>
                : {data.message}
              </div>
            </li>
          ) : (
            <li className="list-none" key={index}>
              <div className="bg-slate-950 rounded-xl p-3 m-2 inline-block text-gray-300">
                <span className="text-yellow-100 inline-flex">{data.user}</span>
                : {data.message}
              </div>
            </li>
          )
        )}
        <div ref={ref} />
      </ScrollArea>

      <Chat
        handleSubmit={handleSubmit}
        message={message}
        setMessage={setMessage}
        name={session?.user.name}
        joinRoom={joinRoom}
        room={room}
        setRoom={setRoom}
      />
    </div>
  );
}

export default ChatComponent;
