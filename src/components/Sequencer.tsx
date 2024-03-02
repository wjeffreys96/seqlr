import { Dispatch, SetStateAction } from "react";
import { cn } from "../utils/cn";

export default function Sequencer({
  setSelectedBoxes,
}: {
  setSelectedBoxes: Dispatch<SetStateAction<any>>;
}) {
  const inputsArr: { id: number }[] = [];
  for (let index = 0; index < 16; index++) {
    inputsArr.push({ id: index });
  }
  const handleSelectBox = (ids: any) => {
    // TODO set type
    console.log(ids.id);
    setSelectedBoxes({
      id: ids.id,
    });
  };

  const containerStyles = cn("flex", "gap-2");
  const checkboxStyles = cn("flex", "text-center", "text-blue-300", "flex-col");

  return (
    <div className={containerStyles}>
      {inputsArr.map(function (ids: { id: number }) {
        return (
          <div key={ids.id} className={checkboxStyles}>
            |{ids.id}|
            <div>
              <input
                id={String(ids.id)}
                onChange={(ids) => handleSelectBox(ids)}
                type="checkbox"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
