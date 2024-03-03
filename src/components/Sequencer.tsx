import { Dispatch, SetStateAction, useContext } from "react";
import { cn } from "../utils/cn";
import { AudioContextType, audioCtx } from "../AudioContext";

export default function Sequencer({
  selectedBoxes,
  setSelectedBoxes,
}: {
  selectedBoxes: [];
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const { currentNote } = state;
  const inputsArr: { id: number }[] = [];

  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index });
  }

  const handleSelectBox = (obj: { id: number }) => {
    // TODO set type
    const objExists = selectedBoxes.find((el: { id: number }) => {
      return el.id === obj.id;
    });
    if (!objExists) {
      setSelectedBoxes([...selectedBoxes, obj]);
    } else {
      selectedBoxes.splice(selectedBoxes.indexOf(objExists), 1);
    }
  };

  const containerStyles = cn("flex gap-2");
  const checkboxStyles = cn("flex text-center text-blue-300 flex-col");

  return (
    <div className={containerStyles}>
      {inputsArr.map(function (obj: { id: number }) {
        return (
          <div key={obj.id} className={checkboxStyles}>
            {obj.id === currentNote ? (
              <span>|{obj.id}|</span>
            ) : (
              <span>{obj.id}</span>
            )}
            <div>
              <input
                id={String(obj.id)}
                onChange={() => handleSelectBox(obj)}
                type="checkbox"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
