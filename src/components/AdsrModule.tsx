import { useContext } from "react";
import { audioCtx } from "../AudioContext";
import { AudioContextType } from "../@types/AudioContext";
import LogSlider from "./ui/LogSlider";
import type { LogSliderProps } from "../@types/LogSlider";

export default function AdsrModule() {
  const actx: AudioContextType = useContext(audioCtx);
  const { state, dispatch } = actx;

  const knobArr = [
    {
      id: 1,
      name: "Attack",
    },
    {
      id: 2,
      name: "Decay",
    },
    {
      id: 3,
      name: "Sustain",
    },
    {
      id: 4,
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
              className="rounded-lg bg-sky-950 px-2 border-neutral-600 border shadow-neutral-700 shadow-sm"
            >
              <label key={"klk" + obj.id}>
                <span>{obj.name}:</span>
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
