import { Dispatch, SetStateAction, useContext } from "react";
import { cn } from "../utils/cn";
import { AudioContextType, audioCtx } from "../AudioContext";

export default function Sequencer({
  selectedBoxes,
  setSelectedBoxes,
}: {
  selectedBoxes: any;
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const { currentNote, masterPlaying } = state;
  const inputsArr: { id: number }[] = [];

  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index });
  }

  const handleChangeBox = (obj: { id: number }) => {
    // TODO set type
    const isSelected = selectedBoxes.find((el: { id: number }) => {
      return el.id === obj.id;
    });
    if (!isSelected) {
      setSelectedBoxes([...selectedBoxes, obj]);
    } else {
      selectedBoxes.splice(selectedBoxes.indexOf(isSelected), 1);
    }
  };

  const containerStyles = cn("flex gap-2");
  const checkboxStyles = cn("flex text-center text-blue-300 flex-col w-6");

  return (
    <div className={containerStyles}>
      {inputsArr.map(function (obj: { id: number }) {
        return (
          <div key={obj.id} className={checkboxStyles}>
            {(masterPlaying && obj.id === currentNote - 1) ||
            (masterPlaying && currentNote === 0 && obj.id === 15) ? (
              <span>|{obj.id + 1}|</span>
            ) : (
              <span>{obj.id + 1}</span>
            )}
            <input
              className="mt-2"
              id={String(obj.id)}
              onChange={() => handleChangeBox(obj)}
              type="checkbox"
            />
          </div>
        );
      })}
    </div>
  );
}
