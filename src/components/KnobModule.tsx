import { useContext, useEffect, useState, useRef } from "react";
import { audioCtx } from "../AudioContext.ctx";
import { AudioContextType } from "../@types/AudioContext";

export default function KnobModule({ outerIndex }: { outerIndex: number }) {
  const actx: AudioContextType = useContext(audioCtx);
  const { state, dispatch } = actx;
  const [knobsDisabled, setKnobsDisabled] = useState(true);
  const selectRef = useRef<HTMLSelectElement>(null);

  const octaves: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

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
          const copiedGlobNoteArr = state.globNoteArr;
          const thisArr = copiedGlobNoteArr[outerIndex];
          thisArr.attack = Number(e.target.value);
          dispatch({ type: "SETGLOBNOTEARR", payload: copiedGlobNoteArr });
        },
      },
      {
        id: 2,
        name: "Release",
        min: "0.01",
        max: "1",
        step: "0.01",
        default: "0.03",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          const copiedGlobNoteArr = state.globNoteArr;
          const thisArr = copiedGlobNoteArr[outerIndex];
          thisArr.release = Number(e.target.value);
          dispatch({ type: "SETGLOBNOTEARR", payload: copiedGlobNoteArr });
        },
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

    const waveFormButtonArr = [
      {
        id: 1,
        name: "Sine",
      },
      {
        id: 2,
        name: "Square",
      },
      {
        id: 3,
        name: "Saw",
      },
    ];

    const handleOctaveChange = () => {
      const copiedGlobNoteArr = state.globNoteArr;
      const thisArr = copiedGlobNoteArr[outerIndex];
      thisArr.octave = Number(selectRef.current?.value);
      dispatch({ type: "SETGLOBNOTEARR", payload: copiedGlobNoteArr });
    };

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
        <form
          className="rounded-lg bg-neutral-900 px-2 py-1 border-neutral-600 border shadow-neutral-700 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label className="flex items-center justify-center gap-2 text-left text-zinc-200 text-sm">
            Oct:
            <div>
              <select
                name="OctaveSelecter"
                ref={selectRef}
                defaultValue="3"
                onChange={(e) => {
                  e.preventDefault();
                  handleOctaveChange();
                }}
                className="rounded-full min-w-14 bg-neutral-900 text-cyan-200 text-center text-sm px-0.5 py-[3px]"
              >
                {octaves.map((oct) => {
                  return <option key={"ook" + oct}>{oct}</option>;
                })}
              </select>
            </div>
          </label>
        </form>

        <div className="min-w-48 flex justify-around items-center rounded-lg border border-red-500">
          {waveFormButtonArr.map((btn) => {
            return (
              <button
                key={"wfba" + btn.id}
                className="rounded-full text-xs m-2 p-0.5 border border-red-500"
              >
                {btn.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  } else {
    throw new Error("actx not initialized");
  }
}
