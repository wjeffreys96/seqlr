import { useContext } from "react";
import { audioCtx } from "../AudioContext";
import { AudioContextType } from "../@types/AudioContext";

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
          return (
            <div
              key={"kdk" + obj.id}
              className="rounded-lg bg-neutral-800 px-2 border-zinc-500 border"
            >
              <label key={"klk" + obj.id}>
                <span>{obj.name}</span>
                <div>
                  <input type="range" />
                </div>
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
