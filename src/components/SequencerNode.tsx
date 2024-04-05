import { NoteObject } from "../@types/AudioContext";
import { useState } from "react";
import { cn } from "../utils/cn";
export default function SequencerNode({
  obj,
  columnIsPlaying,
  handleChangeCheckbox,
  handleChangeOffset,
}: {
  obj: NoteObject;
  columnIsPlaying: boolean;
  handleChangeCheckbox: (obj: NoteObject) => void;
  handleChangeOffset: (obj: NoteObject) => void;
}) {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <label
      htmlFor={String("cbi" + obj.id)}
      key={String("cbk" + obj.id)}
      className={cn(
        "cursor-pointer flex lg:h-20 lg:w-16 md:w-12 w-8 justify-center text-center text-blue-300 flex-col pb-2 pt-1 px-1 rounded ease-in-out transition-all mt-1",
        columnIsPlaying
          ? "bg-blue-900 mt-0"
          : "bg-neutral-800 hover:bg-neutral-600",
        selected && !columnIsPlaying && "bg-neutral-700",
      )}
    >
      {<span className="text-white mb-2">{obj.id + 1}</span>}
      <input
        className="my-2 hidden"
        id={String("cbi" + obj.id)}
        onChange={() => {
          handleChangeCheckbox(obj);
          setSelected(!selected);
        }}
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
}
