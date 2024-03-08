import { useRef, useState } from "react";
import { useContext } from "react";
import { audioCtx, AudioContextType } from "./AudioContext";
import { PlayIcon, StopIcon } from "./assets/icons";
import LogSlider, { LogSliderProps } from "./components/ui/LogSlider";
import Scheduler from "./components/Scheduler";
import Sequencer from "./components/Sequencer";
import { cn } from "./utils/cn";
import { Button } from "./components/ui/MovingBorder";

export default function App() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { toggleMasterPlayPause, state } = actx;
  const { masterPlaying, masterVol } = state;
  const masterVolRef = useRef<HTMLInputElement>(null);
  const freqRef = useRef<HTMLInputElement>(null);
  const [freq, setfreq] = useState<number>(440);
  const [selectedBoxes, setSelectedBoxes] = useState<any>([]); // TODO set type

  const handleMasterVolChange = (values: {
    position: number;
    value: number;
  }) => {
    if (masterVol) {
      masterVol.gain.value = values.value / 100;
    }
  };

  const handleFreqChange = (input: { position: number; value: number }) => {
    setfreq(input.value);
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

  const FreqSliderOpts: LogSliderProps = {
    ref: freqRef,
    defaultValue: 440,
    onChange: handleFreqChange,
    labelFor: "Frequency:",
    minpos: 0,
    maxpos: 100,
    minval: 20,
    maxval: 20000,
    unit: "hz",
  };

  const mainStyles = cn(
    "min-h-screen font-sans bg-neutral-900 text-white flex flex-col gap-3 justify-center items-center"
  );

  const schedulerStyles = cn(
    "flex justify-between gap-4 border rounded p-2 py-4 bg-neutral-800  border-neutral-500"
  );

  const sliderStyles = cn(
    "flex justify-between gap-4 border rounded p-2 py-4 bg-neutral-800 border-neutral-500"
  );

  return (
    <>
      {actx ? (
        <main className={mainStyles}>
          <h1 className="text-4xl">SEQLR</h1>
          <div className="flex gap-2 h-12">
            <Button
              isDisplay={masterPlaying}
              borderRadius=".25rem"
              className={"border border-neutral-500 bg-neutral-800"}
              onClick={toggleMasterPlayPause}
            >
              {!masterPlaying ? <PlayIcon /> : <StopIcon />}
            </Button>
            <div className={schedulerStyles}>
              <Scheduler selectedBoxes={selectedBoxes} freq={freq} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className={sliderStyles}>
              <LogSlider options={MasterVolSliderOpts} />
            </div>

            <div className={sliderStyles}>
              <LogSlider options={FreqSliderOpts} />
            </div>
          </div>
          <Sequencer
            selectedBoxes={selectedBoxes}
            setSelectedBoxes={setSelectedBoxes}
          />
        </main>
      ) : (
        <h1 className="text-4xl">Loading...</h1>
      )}
    </>
  );
}
