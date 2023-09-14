import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, FormEventHandler } from "react";

type ChatProps = {
  name?: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  message: string;
  setMessage: Dispatch<React.SetStateAction<string>>;
  room: string;
  joinRoom: () => void;
  setRoom: Dispatch<React.SetStateAction<string>>;
};

const Chat: React.FC<ChatProps> = ({
  handleSubmit,
  message,
  setMessage,
  name,
  room, joinRoom, setRoom
}) => {
  return (
    <>
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="escribe un mensaje"
        minLength={6}
        name="message"
        id="message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <Button variant="default">Enviar</Button>      
    </form>
    <Input
        type="text"
        placeholder="elije una sala"
        name="room"
        id="room"
        value={room}
        onChange={(e) => {
          setRoom(e.target.value);
        }}
      />
      <Button onClick={joinRoom} variant="default">Entrar</Button>
    </>
  );
};

export default Chat;
