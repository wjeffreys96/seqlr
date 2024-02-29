import { useRef, useState } from "react";
import { useContext } from "react";
import { audioCtx, AudioContextType } from "./AudioContext";
import PlayIcon from "./components/ui/icons/PlayIcon";
import PauseIcon from "./components/ui/icons/PauseIcon";
import LogSlider, { LogSliderProps } from "./components/ui/LogSlider";
import Scheduler from "./components/Scheduler";

export default function App() {
  console.log("Rendering App...");
  const actx = useContext<AudioContextType>(audioCtx);
  const { toggleMasterPlayPause, state } = actx;
  const { masterPlaying, masterVol } = state;
  const masterVolRef = useRef<HTMLInputElement>(null);
  const freqRef = useRef<HTMLInputElement>(null);

  const [freqVal, setFreqVal] = useState<number>(440);

  const handleMasterVolChange = (values: {
    position: number;
    value: number;
  }) => {
    masterVol!.gain.value = values.value / 100;
  };

  const handleFreqChange = (input: { position: number; value: number }) => {
    setFreqVal(input.value);
  };

  const MasterVolSliderOpts: LogSliderProps = {
    ref: masterVolRef,
    onInput: handleMasterVolChange,
    labelFor: "masterVolume",
    defaultValue: 100,
    minval: 0,
    maxval: 100,
    unit: "",
  };

  const FreqSliderOpts: LogSliderProps = {
    ref: freqRef,
    defaultValue: 440,
    onInput: handleFreqChange,
    labelFor: "frequency",
    minpos: 0,
    maxpos: 100,
    minval: 20,
    maxval: 20000,
    unit: "hz",
  };

  return (
    <>
      {actx ? (
        <main className="min-h-screen font-sans bg-neutral-900 text-white flex flex-col gap-3 justify-center items-center">
          <h1 className="text-4xl">SEQLR</h1>
          <div className="flex gap-2 h-12 ">
            <button
              className="border border-neutral-500 rounded-md px-2 bg-neutral-800 shadow-md shadow-slate-800"
              onClick={toggleMasterPlayPause}
            >
              {!masterPlaying ? <PlayIcon /> : <PauseIcon />}
            </button>
            <div className="flex justify-between gap-4 border rounded p-2 py-4 bg-neutral-800  border-neutral-500 shadow-md shadow-slate-800">
              <Scheduler freqVal={freqVal} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4 border rounded p-2 py-4 bg-neutral-800 border-neutral-500 shadow-md shadow-slate-800">
              <label
                className="text-neutral-300"
                htmlFor="masterVolume"
              >
                Master Volume:
              </label>
              <LogSlider options={MasterVolSliderOpts} />
            </div>

            <div className="flex justify-between gap-4 border rounded p-2 py-4 bg-neutral-800  border-neutral-500 shadow-md shadow-slate-800">
              <label className="text-neutral-300" htmlFor="frequency">
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
