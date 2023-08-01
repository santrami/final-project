import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

function SigninButton() {
  const { data: session } = useSession();
  session?.user.accessToken

  if (session && session.user) {
    return (
      <div>
        <div className="flex gap-4 ml-auto">
          <p className="text-sky-600">{session.user.name}</p>
          <Button onClick={() => signOut()} variant="default">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn()} variant="default">
      Sign In
    </Button>
  );
}

export default SigninButton;
