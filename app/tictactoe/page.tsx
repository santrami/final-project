import Link from "next/link";

export default function Page() {
  return (
    <>
      <div>
        <Link href={"/tictactoe/sGame"}>Single Player</Link>
      </div>
      {/*<div>
          <Link href={"/tictactoe/sGame"}>Multi Player</Link>
        </div>*/}
      <div>
        <Link href={"/tictactoe/mGame"}>Multi Player</Link>
      </div>
    </>
  );
}