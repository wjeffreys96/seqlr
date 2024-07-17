import { LogSliderProps } from "../../@types/LogSlider";
import { useRef, useContext } from "react";
import { audioCtx } from "../../AudioContext.ctx.tsx";
import { AudioContextType } from "../../@types/AudioContext";
import { Button } from "./MovingBorder";
import { PlayIcon, StopIcon } from "../../assets/icons";
import LogSlider from "./LogSlider";
import Scheduler from "../Scheduler";
import RootSelecter from "../RootSelecter";
import InputWithLabel from "../InputWithLabel.tsx";

export default function Nav() {
  const masterVolRef = useRef<HTMLInputElement>(null);
  const actx = useContext<AudioContextType>(audioCtx);
  const { toggleMasterPlayPause, state } = actx;

  if (state) {
    const { masterVol, masterPlaying, globNoteArr } = state;

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
      defaultValue: 25,
      minval: 0,
      maxval: 100,
      unit: "",
    };

    return (
      <nav className="flex h-16 bg-zinc-900 shadow-zinc-950 text-black shadow-sm z-40 items-center justify-center">
        <div className="flex gap-[1px] h-12">
          <Button
            isDisplay={masterPlaying}
            borderRadius=".25rem"
            className="border border-neutral-600 bg-neutral-800 h-full"
            onClick={toggleMasterPlayPause}
          >
            {!masterPlaying ? <PlayIcon /> : <StopIcon />}
          </Button>
          <Scheduler globNoteArr={globNoteArr} />
          <RootSelecter />
          <div className="flex justify-between gap-4 border rounded p-2 m-[1px] bg-neutral-800 border-neutral-600">
            <LogSlider options={MasterVolSliderOpts} />
          </div>
          <InputWithLabel
            onSubmit={(e) => {
              e.preventDefault();
            }}
            labelText="Sequencers: "
          >
            <input type="number" className="bg-inherit w-8 text-center" />
          </InputWithLabel>
        </div>
      </nav>
    );
  } else throw new Error("state is undefined");
}
