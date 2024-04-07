import { useContext } from "react";
import { audioCtx } from "../AudioContext";
import type { AudioContextType } from "../@types/AudioContext";
import { NoteObject } from "../@types/AudioContext";
import SequencerNode from "./SequencerNode";

export default function Sequencer() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, dispatch, spliceSelectedBoxes } = actx;

  if (state && dispatch && spliceSelectedBoxes) {
    const {
      currentNote,
      masterPlaying,
      selectedBoxes,
    }: {
      currentNote: number;
      masterPlaying: boolean;
      selectedBoxes: NoteObject[];
    } = state;
    const inputsArr: NoteObject[] = [];

    for (let index = 0; index < 16; index++) {
      inputsArr.push({ id: index, offset: 0 });
    }

    const handleChangeCheckbox = (obj: NoteObject) => {
      const isSelected = selectedBoxes.find((el: NoteObject) => {
        return el.id === obj.id;
      });
      if (!isSelected) {
        // setSelectedBoxes([...selectedBoxes, obj]);
        dispatch({ type: "SETSELECTEDBOXES", payload: obj });
      } else if (selectedBoxes) {
        spliceSelectedBoxes(selectedBoxes.indexOf(isSelected));
      }
    };

    const handleChangeOffset = (obj: NoteObject) => {
      const isSelected = selectedBoxes.find((el: NoteObject) => {
        return el.id === obj.id;
      });
      if (isSelected) {
        // selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
        // setSelectedBoxes([...selectedBoxes, { id: obj.id, offset: obj.offset }]);
        spliceSelectedBoxes(selectedBoxes.indexOf(isSelected));
        dispatch({
          type: "SETSELECTEDBOXES",
          payload: { id: obj.id, offset: obj.offset },
        });
      }
    };

    return (
      <div className="flex gap-2">
        {inputsArr.map(function(obj: NoteObject) {
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
    );
  } else {
    throw new Error("actx is undefined");
  }
}
