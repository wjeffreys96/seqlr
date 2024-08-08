import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";

export default function App() {
  return (
    <>
      <div className="font-sans text-white bg-inherit">
        <h1 className="w-32 h-12 text-center absolute z-50 left-6 top-2 italic bg-gradient-to-r from-neutral-500 via-neutral-300 via-60% to-neutral-400 text-transparent bg-clip-text font-bold text-4xl">
          SEQLR
        </h1>
        <Nav />
        <main className="mx-auto max-w-7xl min-h-custom max-h-custom overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-500 ">
          <Sequencer />
        </main>
      </div>
    </>
  );
}
