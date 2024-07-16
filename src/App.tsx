import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";
import Wrapper from "./components/Wrapper";

export default function App() {
  return (
    <div className="font-sans text-white bg-zinc-900">
      <h1 className="w-32 h-12 text-center absolute left-6 top-2 italic bg-gradient-to-r from-neutral-500 via-neutral-300 via-60% to-neutral-400 text-transparent bg-clip-text font-bold text-4xl">
        SEQLR
      </h1>
      <Nav />
      <Wrapper>
        <main className="min-h-custom flex flex-col gap-3 justify-center items-center">
          <Sequencer />
        </main>
      </Wrapper>
    </div>
  );
}
