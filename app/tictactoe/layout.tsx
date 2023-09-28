export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col bg-black h-screen">
      <h1 className="self-center text-3xl p-5 text-lime-200">TicTacToe</h1>
      <div className="container">
        <div className="flex flex-col bg-sky-950 p-20">{children}</div>
      </div>
    </div>
  );
}