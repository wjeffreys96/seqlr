import { AudioContextProvider } from "./AudioContext";
import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";

export default function App() {
  return (
    <>
      <div className="font-sans text-white bg-inherit overflow-hidden">
        <AudioContextProvider>
          <Nav />
          <Sequencer />
        </AudioContextProvider>
      </div>
    </>
  );
}
