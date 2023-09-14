import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

function SigninButton() {
  const { data: session } = useSession();
  session?.user.accessToken;
  //console.log(session)

  if (session && session.user) {
    return (
      <div className="flex gap-6 items-center">
        <div className="flex gap-3">
          {/* <Image
            src={session.user.image ? session.user.image : "https://placehold.co/600x400"}
            alt="userIcon"
            width="30"
            height="30"
          /> */}
          <p className="text-sky-600">{session.user.name}</p>
        </div>
        <Button onClick={() => signOut()} variant="default">
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
