import { useRef, useContext } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
import { noteFreqs } from "../utils/utils";
import type { AudioContextType } from "../@types/AudioContext.d.ts";

export default function RootSelecter() {
  const notes = Object.keys(noteFreqs);
  const selectRef = useRef<HTMLSelectElement>(null);
  const actx: AudioContextType = useContext<AudioContextType>(audioCtx);
  const { dispatch } = actx;

  if (actx && dispatch) {
    return (
      <form
        className="flex justify-between items-center gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label className="flex items-center justify-center gap-2 text-left text-zinc-200 text-sm">
          Root:
          <div>
            <select
              name="RootSelecter"
              ref={selectRef}
              onChange={(e) => {
                e.preventDefault();
                if (selectRef.current) {
                  dispatch({
                    type: "SETCURRENTROOT",
                    payload: selectRef.current.value,
                  });
                }
              }}
              className="rounded-full min-w-14 bg-neutral-900 text-cyan-200 text-center text-sm px-0.5 py-[3px]"
            >
              {notes.map((note) => {
                return <option key={"nk" + note}>{note}</option>;
              })}
            </select>
          </div>
        </label>
      </form>
    );
  } else throw new Error("actx is undefined");
}
