import { useContext } from "react";
import { cn } from "../utils/cn.ts";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType, SequencerObject } from "../@types/AudioContext";
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
      nodeCount,
    }: {
      currentNote: number;
      masterPlaying: boolean;
      globNoteArr: SequencerObject[];
      nodeCount: number;
    } = state;

    if (globNoteArr.length > 0) {
      return (
        <>
          {globNoteArr.map((arr, outerIndex) => {
            return (
              <div
                key={"gnak" + outerIndex}
                className="flex flex-col gap-4 mx-1.5 my-2 bg-neutral-800 p-4 rounded-lg border border-neutral-700"
              >
                <KnobModule outerIndex={outerIndex} />
                <div
                  className={cn(
                    "flex gap-2 scrollbar-thumb-neutral-600 scrollbar-thin overflow-auto bg-neutral-900 p-5 rounded-xl ",
                    nodeCount <= 16 && "justify-center",
                  )}
                >
                  {arr.innerArr.map((obj: NoteObject) => {
                    const columnIsPlaying =
                      (masterPlaying && obj.id === currentNote - 1) ||
                      (masterPlaying &&
                        currentNote === 0 &&
                        obj.id === nodeCount - 1);
                    return (
                      <SequencerNode
                        key={"snk" + obj.id}
                        obj={obj}
                        outerIndex={outerIndex}
                        columnIsPlaying={columnIsPlaying}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      );
    }
  } else {
    throw new Error("actx is undefined");
  }
}
