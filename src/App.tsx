import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";
import Wrapper from "./components/Wrapper";

export default function App() {
  return (
    <div className="font-sans text-white bg-neutral-900">
      <Nav />
      <Wrapper>
        <main className="min-h-custom flex flex-col gap-3 justify-center items-center">
          <Sequencer />
        </main>
      </Wrapper>
    </div>
  );
}
