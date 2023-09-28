import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

function SigninButton() {
  const { data: session } = useSession();
  session?.user.accessToken;
  if (session && session.user) {
    return (
      <div className="flex gap-6 items-center">
        <div className="flex gap-3">
          <p className="text-sky-600">{session.user.name}</p>
        </div>
        <Button onClick={() => signOut()} variant="destructive">
          Sign Out
        </Button>
      </div>
    );
  }
  return (
    <>
      <Button
        onClick={async () =>
          await signIn("undefined", {
            callbackUrl: "http://localhost:3000/game",
          })
        }
        variant="default"
      >
        Sign In
      </Button>
      <Link href="/register">
        <Button>Register</Button>
      </Link>
    </>
  );
}

export default SigninButton;
