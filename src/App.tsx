import { useState } from "react";
import Sequencer from "./components/Sequencer";
import Nav from "./components/ui/Nav";
import { NoteObject } from "./@types/Sequencer";

export default function App() {
  const [selectedBoxes, setSelectedBoxes] = useState<NoteObject[]>([]);

  return (
    <div className="font-sans text-white bg-neutral-900">
      <Nav selectedBoxes={selectedBoxes} />
      <main className="min-h-custom max-w-7xl mx-auto flex flex-col gap-3 items-center">
        <div className="my-auto">
          <Sequencer
            selectedBoxes={selectedBoxes}
            setSelectedBoxes={setSelectedBoxes}
          />
        </div>
      </main>
    </div>
  );
}
