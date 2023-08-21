import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";

function SigninButton() {
  const { data: session } = useSession();
  session?.user.accessToken;

  if (session && session.user) {
    {
      console.log(session.user);
    }
    return (
      <div className="flex gap-6 items-center">
        <div className="flex gap-3">
          <Image
            src={session.user.image}
            alt="userIcon"
            width="30"
            height="30"
          />
          <p className="text-sky-600">{session.user.name}</p>
        </div>
        <Button onClick={() => signOut()} variant="default">
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={async () => await signIn()} variant="default">
      Sign In
    </Button>
  );
}

export default SigninButton;
