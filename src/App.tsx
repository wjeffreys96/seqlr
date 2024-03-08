import { useRef, useState } from "react";
import { useContext } from "react";
import { audioCtx, AudioContextType } from "./AudioContext";
import { PlayIcon, StopIcon } from "./assets/icons";
import LogSlider, { LogSliderProps } from "./components/ui/LogSlider";
import Scheduler from "./components/Scheduler";
import Sequencer from "./components/Sequencer";
import RootSelecter from "./components/RootSelecter";
import { cn } from "./utils/cn";
import { Button } from "./components/ui/MovingBorder";

export default function App() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { toggleMasterPlayPause, state } = actx;
  const { masterPlaying, masterVol } = state;
  const masterVolRef = useRef<HTMLInputElement>(null);
  const [selectedBoxes, setSelectedBoxes] = useState<any[]>([]); // TODO set type

  const handleMasterVolChange = (values: {
    position: number;
    value: number;
  }) => {
    if (masterVol) {
      masterVol.gain.value = values.value / 100;
    }
  };

  const MasterVolSliderOpts: LogSliderProps = {
    ref: masterVolRef,
    onChange: handleMasterVolChange,
    labelFor: "Master Volume:",
    defaultValue: 100,
    minval: 0,
    maxval: 100,
    unit: "",
  };

  const commonStyles = cn(
    "flex justify-between gap-4 border rounded p-2 bg-neutral-800 border-neutral-500"
  );

  return (
    <>
      {actx && (
        <main className="min-h-screen font-sans bg-neutral-900 text-white flex flex-col gap-3 items-center w-full">
          <nav className="flex items-center justify-center w-full h-16">
            <div className="flex gap-2 h-12">
              <Button
                isDisplay={masterPlaying}
                borderRadius=".25rem"
                className="border border-neutral-500 bg-neutral-800 h-full"
                onClick={toggleMasterPlayPause}
              >
                {!masterPlaying ? <PlayIcon /> : <StopIcon />}
              </Button>
              <div className={commonStyles}>
                <Scheduler selectedBoxes={selectedBoxes} />
              </div>
              <div className={commonStyles}>
                <RootSelecter />
              </div>
              <div className={commonStyles}>
                <LogSlider options={MasterVolSliderOpts} />
              </div>
            </div>
          </nav>

          <div className="my-auto">
            <Sequencer
              selectedBoxes={selectedBoxes}
              setSelectedBoxes={setSelectedBoxes}
            />
          </div>
        </main>
      )}
    </>
  );
}
