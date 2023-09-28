import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dispatch, FormEventHandler } from "react";

type ChatProps = {
  name?: string;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  message: string;
  setMessage: Dispatch<React.SetStateAction<string>>;
};

const Message: React.FC<ChatProps> = ({
  handleSubmit,
  message,
  setMessage,
 
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
    </>
  );
};

export default Message;
