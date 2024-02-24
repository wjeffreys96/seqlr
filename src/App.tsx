import { useRef, useState } from "react";
import { useContext } from "react";
import { audioCtx, AudioContextType } from "./AudioContext";

import PlayIcon from "./components/ui/icons/PlayIcon";
import PauseIcon from "./components/ui/icons/PauseIcon";
import LogSlider from "./components/ui/LogSlider";
import Scheduler from "./components/Scheduler";

export default function App() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { masterPlaying, engine, masterVol } = actx.state;
  const { dispatch, playTone } = actx;
  const masterVolRef = useRef<HTMLInputElement>(null);
  const freqRef = useRef<HTMLInputElement>(null);
  const [freq, setFreq] = useState(440);

  const handleMasterPlayPause = () => {
    if (!masterPlaying && engine && masterVol) {
      dispatch({ type: "TOGGLEMASTERPLAYING" });
      playTone({ type: "sine", freq: freq, duration: 150 }, engine, masterVol);
    } else {
      dispatch({ type: "TOGGLEMASTERPLAYING" });
    }
  };

  const handleMasterVolChange = (values: {
    position: number;
    value: number;
  }) => {
    masterVol!.gain.value = values.value / 100;
  };

  const handleFreqChange = (values: { position: number; value: number }) => {
    setFreq(values.value);
  };

  const MasterVolSliderOpts = {
    ref: masterVolRef,
    onInput: handleMasterVolChange,
    labelFor: "masterVolume",
    defaultValue: 100,
    minval: 0,
    maxval: 100,
  };

  const FreqSliderOpts = {
    ref: freqRef,
    onInput: handleFreqChange,
    labelFor: "frequency",
    minpos: 0,
    maxpos: 100,
    minval: 1,
    maxval: 20000,
  };

  return (
    <>
      <main className="min-h-screen font-sans bg-zinc-800 text-white flex flex-col gap-4 justify-center items-center">
        <h1 className="text-4xl">SEQLR</h1>
        <button
          className="border rounded-md p-2 bg-zinc-700"
          onClick={() => handleMasterPlayPause()}
        >
          {!masterPlaying ? <PlayIcon /> : <PauseIcon />}
        </button>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            {audioCtx && <Scheduler />}
          </div>

          <div className="flex justify-between border rounded p-4 bg-zinc-700 border-zinc-600 p">
            <label className="w-32 text-left" htmlFor="masterVolume">
              Master Volume:
            </label>
            <LogSlider options={MasterVolSliderOpts} />
          </div>
          <div className="flex justify-evenly gap-4 border rounded p-4 bg-zinc-700 border-zinc-600 p">
            <label className="w-32 text-left" htmlFor="frequency">
              Frequency:
            </label>
            <LogSlider options={FreqSliderOpts} />
          </div>
        </div>
      </main>
    </>
  );
}
