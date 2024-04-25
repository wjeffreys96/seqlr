import { useContext, useEffect, useState } from "react";
import { audioCtx } from "../AudioContext.ctx";
import { AudioContextType } from "../@types/AudioContext";

export default function KnobModule({ outerIndex }: { outerIndex: number }) {
  const actx: AudioContextType = useContext(audioCtx);
  const { state, dispatch } = actx;
  const [knobsDisabled, setKnobsDisabled] = useState(true);
  useEffect(() => {
    if (state?.globNoteArr[0]?.gain) {
      setKnobsDisabled(false);
    }
  }, [state]);
  if (state && dispatch) {
    const knobArr = [
      {
        id: 1,
        name: "Attack",
        min: "0.01",
        max: "0.5",
        step: "0.01",
        default: "0.03",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({ type: "SETATTACK", payload: Number(e.target.value) });
        },
      },
      {
        id: 2,
        name: "Release",
        min: "0.01",
        max: "1",
        step: "0.01",
        default: "0.03",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch({ type: "SETRELEASE", payload: Number(e.target.value) }),
      },
      {
        id: 3,
        name: "Volume",
        min: "0.01",
        max: "1",
        step: "0.01",
        default: "0.5",
        disabled: knobsDisabled,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const copiedGlobNoteArr = state.globNoteArr;
          const thisArr = copiedGlobNoteArr[outerIndex];
          if (thisArr.gain && state.engine?.currentTime) {
            thisArr.gain.gain.value = Number(e.target.value);
            dispatch({ type: "SETGLOBNOTEARR", payload: copiedGlobNoteArr });
          }
        },
      },
    ];

    return (
      <div className="flex gap-2 items-center justify-center">
        {knobArr.map((obj) => {
          // const sliderOpts: LogSliderProps = {}
          return (
            <div
              key={"kdk" + obj.id}
              className="rounded-lg bg-zinc-900 px-2 py-1 border-neutral-600 border shadow-neutral-700 shadow-sm"
            >
              <label
                className="flex flex-row gap-1 items-center justify-center"
                key={"klk" + obj.id}
              >
                <span className="text-zinc-200">{obj.name}:</span>
                <input
                  disabled={obj.disabled}
                  className="h-1"
                  defaultValue={obj.default}
                  type="range"
                  min={obj.min}
                  max={obj.max}
                  step={obj.step}
                  onChange={obj.onChange}
                />
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
