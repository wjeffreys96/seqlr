import { LogSliderProps } from "../../@types/LogSlider";
import { NoteObject } from "../../@types/Sequencer";
import { useRef, useContext } from "react";
import { audioCtx } from "../../AudioContext";
import { AudioContextType } from "../../@types/AudioContext";
import { Button } from "./MovingBorder";
import { PlayIcon, StopIcon } from "../../assets/icons";
import { cn } from "../../utils/cn";
import LogSlider from "./LogSlider";
import Scheduler from "../Scheduler";
import RootSelecter from "../RootSelecter";

export default function Nav({
  selectedBoxes,
}: {
  selectedBoxes: NoteObject[];
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { masterVol, toggleMasterPlayPause, state } = actx;
  const { masterPlaying } = state;
  const masterVolRef = useRef<HTMLInputElement>(null);

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
  );
}
