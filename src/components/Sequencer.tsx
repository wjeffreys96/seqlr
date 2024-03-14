import { Dispatch, SetStateAction, useContext } from "react";
import { cn } from "../utils/cn";
import { AudioContextType, audioCtx } from "../AudioContext";

export default function Sequencer({
  selectedBoxes,
  setSelectedBoxes,
}: {
  selectedBoxes: any[]; // TODO type
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const { currentNote, masterPlaying } = state;
  const inputsArr: { id: number; offset: number }[] = [];

  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index, offset: 0 });
  }

  const handleChangeCheckbox = (obj: { id: number; offset: number }) => {
    // TODO set type
    const isSelected = selectedBoxes.find(
      (el: { id: number; offset: number }) => {
        return el.id === obj.id;
      }
    );
    if (!isSelected) {
      setSelectedBoxes([...selectedBoxes, obj]);
    } else {
      selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
    }
  };

  const handleChangeOffset = (obj: { id: number; offset: number }) => {
    // TODO set type
    const isSelected = selectedBoxes.find(
      (el: { id: number; offset: number }) => {
        return el.id === obj.id;
      }
    );
    if (isSelected) {
      selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
      setSelectedBoxes([...selectedBoxes, { id: obj.id, offset: obj.offset }]);
    }
  };

  const wrapperStyles = cn("flex gap-2");

  return (
    <div className={wrapperStyles}>
      {inputsArr.map(function (obj: { id: number; offset: number }) {
        const columnIsPlaying =
          (masterPlaying && obj.id === currentNote - 1) ||
          (masterPlaying && currentNote === 0 && obj.id === 15);
        const columnStyles = cn(
          "flex lg:w-14 md:w-10 w-6 text-center text-blue-300 flex-col pb-2 pt-1 px-1 border rounded",
          columnIsPlaying
            ? "bg-blue-900 border-neutral-200"
            : "bg-neutral-800 border-neutral-500 hover:bg-neutral-700 hover:border-neutral-200"
        );
        return (
          <label
            htmlFor={String("cbi" + obj.id)}
            key={String("cbk" + obj.id)}
            className={columnStyles}
          >
            {<span className="text-white">{obj.id + 1}</span>}
            <input
              className="my-2"
              id={String("cbi" + obj.id)}
              onChange={() => handleChangeCheckbox(obj)}
              type="checkbox"
            />
            <input
              type="number"
              onChange={(e) =>
                handleChangeOffset({
                  id: obj.id,
                  offset: Number(e.target.value),
                })
              }
              placeholder="0"
              min="-12"
              max="12"
              className="text-cyan-200 text-center rounded-full bg-neutral-900 text-sm py-0.5"
            />
          </label>
        );
      })}
    </div>
  );
}
