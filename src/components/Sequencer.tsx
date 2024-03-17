import { Dispatch, SetStateAction, useContext } from "react";
import { cn } from "../utils/cn";
import { audioCtx } from "../AudioContext";
import { AudioContextType } from "../@types/AudioContext";
import { NoteObject } from "../@types/Sequencer";
import SequencerNode from "./SequencerNode";

export default function Sequencer({
  selectedBoxes,
  setSelectedBoxes,
}: {
  selectedBoxes: NoteObject[];
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const { currentNote, masterPlaying } = state;
  const inputsArr: NoteObject[] = [];

  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index, offset: 0 });
  }

  const handleChangeCheckbox = (obj: NoteObject) => {
    const isSelected = selectedBoxes.find((el: NoteObject) => {
      return el.id === obj.id;
    });
    if (!isSelected) {
      setSelectedBoxes([...selectedBoxes, obj]);
    } else {
      selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
    }
  };

  const handleChangeOffset = (obj: NoteObject) => {
    const isSelected = selectedBoxes.find((el: NoteObject) => {
      return el.id === obj.id;
    });
    if (isSelected) {
      selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
      setSelectedBoxes([...selectedBoxes, { id: obj.id, offset: obj.offset }]);
    }
  };

  const wrapperStyles = cn("flex gap-2");

  return (
    <div className={wrapperStyles}>
      {inputsArr.map(function (obj: NoteObject) {
        const columnIsPlaying =
          (masterPlaying && obj.id === currentNote - 1) ||
          (masterPlaying && currentNote === 0 && obj.id === 15);
        const columnStyles = cn(
          "cursor-pointer flex lg:w-14 md:w-10 w-6 text-center text-blue-300 flex-col pb-2 pt-1 px-1 border rounded ease-in-out transition-all",
          columnIsPlaying
            ? "bg-blue-900 border-neutral-200"
            : "bg-neutral-800 border-neutral-500 hover:bg-neutral-700 hover:border-neutral-200"
        );
        return (
          <SequencerNode
            key={"snk" + obj.id}
            obj={obj}
            columnStyles={columnStyles}
            handleChangeCheckbox={handleChangeCheckbox}
            handleChangeOffset={handleChangeOffset}
          />
        );
      })}
    </div>
  );
}
