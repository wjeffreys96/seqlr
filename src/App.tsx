import { useRef } from "react";
import { useContext } from "react";
import { audioCtx, AudioContextType } from "./AudioContext";

import PlayIcon from "./components/ui/icons/PlayIcon";
import PauseIcon from "./components/ui/icons/PauseIcon";
import LogSlider, { LogSliderProps } from "./components/ui/LogSlider";
import Scheduler from "./components/Scheduler";

let freqVal: number = 440;

export default function App() {
  console.log("Rendered App()");
  const actx = useContext<AudioContextType>(audioCtx);
  const { masterPlaying, masterVol, engine } = actx.state;
  const { toggleMasterPlayPause } = actx;
  const masterVolRef = useRef<HTMLInputElement>(null);
  const freqRef = useRef<HTMLInputElement>(null);

  const handleMasterVolChange = (values: {
    position: number;
    value: number;
  }) => {
    masterVol!.gain.value = values.value / 100;
  };

  const handleFreqChange = (input: { position: number; value: number }) => {
    freqVal = input.value;
  };

  const MasterVolSliderOpts: LogSliderProps = {
    ref: masterVolRef,
    onInput: handleMasterVolChange,
    labelFor: "masterVolume",
    defaultValue: 100,
    minval: 0,
    maxval: 100,
  };

  const FreqSliderOpts: LogSliderProps = {
    ref: freqRef,
    onInput: handleFreqChange,
    labelFor: "frequency",
    minpos: 0,
    maxpos: 100,
    minval: 30,
    maxval: 20000,
  };

  return (
    <>
      {actx ? (
        <main className="min-h-screen font-sans bg-zinc-800 text-white flex flex-col gap-4 justify-center items-center">
          <h1 className="text-4xl">SEQLR</h1>
          {engine && <Scheduler freq={freqVal} />}
          <button
            className="border rounded-md p-2 bg-zinc-700"
            onClick={toggleMasterPlayPause}
          >
            {!masterPlaying ? <PlayIcon /> : <PauseIcon />}
          </button>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2 border rounded p-4 bg-zinc-700 border-zinc-600">
              <label className="text-left text-" htmlFor="masterVolume">
                Master Volume:
              </label>
              <LogSlider options={MasterVolSliderOpts} />
            </div>

            <div className="flex justify-between gap-2 border rounded p-4 bg-zinc-700 border-zinc-600">
              <label className="text-left text-" htmlFor="frequency">
                Frequency:
              </label>
              <LogSlider options={FreqSliderOpts} />
            </div>
          </div>
        </main>
      ) : (
        <h1 className="text-4xl">Loading...</h1>
      )}
    </>
  );
}
