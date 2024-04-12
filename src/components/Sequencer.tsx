import { useContext, useEffect } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType } from "../@types/AudioContext";
import { NoteObject } from "../@types/AudioContext";
import SequencerNode from "./SequencerNode";
import KnobModule from "./KnobModule";

export default function Sequencer() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, dispatch, spliceSelectedBoxes } = actx;

  if (state && dispatch && spliceSelectedBoxes) {
    const {
      currentNote,
      masterPlaying,
      nodeArr,
    }: {
      currentNote: number;
      masterPlaying: boolean;
      nodeArr: NoteObject[];
    } = state;

    const handleChangeCheckbox = (obj: NoteObject) => {
      const isSelected = nodeArr.find((el: NoteObject) => {
        return el.id === obj.id;
      });
      if (!isSelected) {
        dispatch({ type: "SETNODEARR", payload: obj });
      } else if (nodeArr) {
        spliceSelectedBoxes(nodeArr.indexOf(isSelected));
      }
    };

    const handleChangeOffset = (obj: NoteObject) => {
      const isSelected = nodeArr.find((el: NoteObject) => {
        return el.id === obj.id;
      });
      if (isSelected) {
        spliceSelectedBoxes(nodeArr.indexOf(isSelected));
        dispatch({
          type: "SETNODEARR",
          payload: { id: obj.id, offset: obj.offset },
        });
      } else {
        dispatch({
          type: "SETNODEARR",
          payload: { id: obj.id, offset: obj.offset },
        });
      }
    };
    return (
      <div className="flex flex-col gap-4 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
        <KnobModule />
        <div className="flex gap-2 bg-neutral-900 p-5 rounded-xl ">
          {state.nodeArr.map(function(obj: NoteObject) {
            const columnIsPlaying =
              (masterPlaying && obj.id === currentNote - 1) ||
              (masterPlaying && currentNote === 0 && obj.id === 15);
            return (
              <SequencerNode
                key={"snk" + obj.id}
                obj={obj}
                columnIsPlaying={columnIsPlaying}
                handleChangeCheckbox={handleChangeCheckbox}
                handleChangeOffset={handleChangeOffset}
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
