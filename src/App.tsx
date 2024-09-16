import { AudioContextProvider } from "./AudioContext";
import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";

export default function App() {
  return (
    <>
      <div className="font-sans text-white bg-inherit overflow-hidden">
        <AudioContextProvider>
          <Nav />
          <main className="min-h-custom">
            <Sequencer />
          </main>
        </AudioContextProvider>
      </div>
    </>
  );
}
