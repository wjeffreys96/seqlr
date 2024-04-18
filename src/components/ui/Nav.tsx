import { LogSliderProps } from "../../@types/LogSlider";
import { useRef, useContext } from "react";
import { audioCtx } from "../../AudioContext.ctx.tsx";
import { AudioContextType } from "../../@types/AudioContext";
import { Button } from "./MovingBorder";
import { PlayIcon, StopIcon } from "../../assets/icons";
import { cn } from "../../utils/cn";
import LogSlider from "./LogSlider";
import Scheduler from "../Scheduler";
import RootSelecter from "../RootSelecter";

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

    const commonStyles = cn(
      "flex justify-between gap-4 border rounded p-2 m-[1px] bg-neutral-800 border-neutral-600",
    );

    return (
      <nav className="flex items-center justify-center w-full h-16">
        <div className="flex gap-[1px] h-12">
          <Button
            isDisplay={masterPlaying}
            borderRadius=".25rem"
            className="border border-neutral-600 bg-neutral-800 h-full"
            onClick={toggleMasterPlayPause}
          >
            {!masterPlaying ? <PlayIcon /> : <StopIcon />}
          </Button>
          <div className={commonStyles}>
            <Scheduler globNoteArr={globNoteArr} />
          </div>
          <div className={commonStyles}>
            <RootSelecter />
          </div>
          <div className={commonStyles}>
            <LogSlider options={MasterVolSliderOpts} />
          </div>
        </div>
      </nav>
    );
  } else throw new Error("state is undefined");
}
