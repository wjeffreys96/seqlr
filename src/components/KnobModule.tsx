import { useContext } from "react";
import { audioCtx } from "../AudioContext.ctx";
import { AudioContextType } from "../@types/AudioContext";
import LogSlider from "./ui/LogSlider";
import type { LogSliderProps } from "../@types/LogSlider";

export default function KnobModule() {
  const actx: AudioContextType = useContext(audioCtx);
  const { state, dispatch } = actx;

  const knobArr = [
    {
      id: 1,
      name: "Attack",
    },
    {
      id: 2,
      name: "Release",
    },
  ];

  if (state && dispatch) {
    return (
      <div className="flex gap-2 items-center">
        {knobArr.map((obj) => {
          // const sliderOpts: LogSliderProps = {}
          return (
            <div
              key={"kdk" + obj.id}
              className="rounded-lg bg-zinc-900 px-2 border-neutral-600 border shadow-neutral-700 shadow-sm"
            >
              <label key={"klk" + obj.id}>
                <span className="text-zinc-200">{obj.name}:</span>
                <div>{/* <LogSlider /> */}</div>
              </label>
            </div>
          );
        })}
      </div>
    );
  } else {
    throw new Error("actx not initialized");
  }
}
