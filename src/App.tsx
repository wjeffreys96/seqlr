import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";
import Wrapper from "./components/Wrapper";

export default function App() {
  return (
    <div className="font-sans text-white bg-zinc-900">
      <h1 className="absolute left-4 top-2 text-neutral-400 italic font-semibold text-3xl">
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
