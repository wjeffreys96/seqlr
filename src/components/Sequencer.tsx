import { Dispatch, SetStateAction, useContext } from "react";
import { cn } from "../utils/cn";
import { AudioContextType, audioCtx } from "../AudioContext";

export default function Sequencer({
  selectedBoxes,
  setSelectedBoxes,
}: {
  selectedBoxes: any[];
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const { currentNote, masterPlaying } = state;
  const inputsArr: { id: number; offset: number }[] = [];

  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index, offset: 0 });
  }

  const handleChangeBox = (obj: { id: number; offset: number }) => {
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

  const wrapperStyles = cn("flex gap-2");
  const columnStyles = cn(
    "w-16 flex text-center text-blue-300 flex-col pb-2 pt-1 mx-1 px-1 bg-neutral-800 border border-neutral-500 rounded"
  );

  return (
    <div className={wrapperStyles}>
      {inputsArr.map(function (obj: { id: number; offset: number }) {
        return (
          <div key={String("cbk" + obj.id)} className={columnStyles}>
            {(masterPlaying && obj.id === currentNote - 1) ||
            (masterPlaying && currentNote === 0 && obj.id === 15) ? (
              <span className="text-white">|{obj.id + 1}|</span>
            ) : (
              <span className="text-white">{obj.id + 1}</span>
            )}
            <input
              className="my-2"
              id={String("cbi" + obj.id)}
              onChange={() => handleChangeBox(obj)}
              type="checkbox"
            />
            <input
              type="number"
              placeholder="0"
              min="-12"
              max="12"
              className="text-cyan-200 text-center rounded-full bg-neutral-900"
            />
          </div>
        );
      })}
    </div>
  );
}
