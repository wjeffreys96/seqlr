import { useContext } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType } from "../@types/AudioContext";
import { NoteObject } from "../@types/AudioContext";
import SequencerNode from "./SequencerNode";
import KnobModule from "./KnobModule";

export default function Sequencer() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, dispatch } = actx;

  if (state && dispatch) {
    const {
      currentNote,
      masterPlaying,
      globNoteArr,
    }: {
      currentNote: number;
      masterPlaying: boolean;
      globNoteArr: NoteObject[];
    } = state;

    return (
      <div className="flex flex-col gap-4 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
        <KnobModule />
        <div className="flex gap-2 bg-neutral-900 p-5 rounded-xl ">
          {globNoteArr.map(function(obj: NoteObject) {
            const columnIsPlaying =
              (masterPlaying && obj.id === currentNote - 1) ||
              (masterPlaying && currentNote === 0 && obj.id === 15);
            return (
              <SequencerNode
                key={"snk" + obj.id}
                obj={obj}
                columnIsPlaying={columnIsPlaying}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    throw new Error("actx is undefined");
  }
}
