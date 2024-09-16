import { useRef, useContext, memo } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
import { noteFreqs } from "../utils/utils.ts";
import type { AudioContextType } from "../@types/AudioContext.d.ts";
import InputLabel from "./InputLabel.tsx";

const RootSelecter = memo(function RootSelecter() {
  console.log("Rendered RootSelecter");
  const notes = Object.keys(noteFreqs);
  const selectRef = useRef<HTMLSelectElement>(null);
  const actx: AudioContextType = useContext<AudioContextType>(audioCtx);
  const { dispatch } = actx;

  if (dispatch) {
    return (
      <InputLabel labelText="Root:">
        <select
          name="RootSelecter"
          className="rounded-full w-10 text-center bg-inherit"
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
        >
          {notes.map((note) => {
            return <option key={"nk" + note}>{note}</option>;
          })}
        </select>
      </InputLabel>
    );
  } else throw new Error("RootSelecter loaded before AudioContext initialized");
});

export default RootSelecter;
