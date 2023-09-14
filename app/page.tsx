"use client";
import TypewriterComponent from "typewriter-effect";
import Image from "next/image";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col container justify-center items-center bg-slate-900 gap-6">
      <div className="text-5xl text-zinc-300 p-8">
        <TypewriterComponent
          options={{
            strings: [
              "Juega a piedra papel o tijeras con tus amigos",
              "Juega a tres en raya con tus amigos",
              "chatea con tus oponentes",
            ],
            autoStart: true,
            loop: true,
            deleteSpeed: 5,
            delay: 100,
          }}
        />
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        Tu portal de juegos en linea
      </div>
      <h1 className="text-4xl text-amber-200">Juega ahora!</h1>
      <div className="flex justify-center items-center gap-10 p-5">
        <Link href={session ? "/game" : "/api/auth/signin"}>
          <Image
            alt="piedra, papel y tijeras"
            src="/piedra-papel-tijeras.jpg"
            width={200}
            height={200}
          />
        </Link>
        <Link href={session ? "/tictactoe" : "/api/auth/signin"}>
          <Image
            alt="piedra, papel y tijeras"
            src="/tres-en-raya.png"
            width={200}
            height={200}
          />
        </Link>
      </div>
    </div>
  );
}
