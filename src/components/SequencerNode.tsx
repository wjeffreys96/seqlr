import { AudioContextType, NoteObject } from "../@types/AudioContext";
import { useState, useContext } from "react";
import { cn } from "../utils/cn";
import { audioCtx } from "../AudioContext.ctx";

export default function SequencerNode({
  obj,
  columnIsPlaying,
}: {
  obj: NoteObject;
  columnIsPlaying: boolean;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const actx: AudioContextType = useContext(audioCtx);
  const { state, toggleNotePlaying, changeOffset } = actx;

  if (state && toggleNotePlaying && changeOffset) {
    return (
      <label
        htmlFor={String("cbi" + obj.id)}
        key={String("cbk" + obj.id)}
        className={cn(
          "bg-neutral-800 border-neutral-500 cursor-pointer flex lg:h-20 lg:w-16 md:w-12",
          "w-8 justify-center text-center text-blue-300 flex-col pb-2 pt-1 px-1 rounded-lg",
          "ease-in-out transition-transform",
          columnIsPlaying ? "-translate-y-1 border" : "hover:bg-cyan-950",
          selected && "bg-cyan-900",
        )}
      >
        {<span className="text-white mb-2">{obj.id + 1}</span>}
        <input
          className="my-2 hidden"
          id={String("cbi" + obj.id)}
          onChange={() => {
            toggleNotePlaying(obj.id);
            setSelected(!selected);
          }}
          type="checkbox"
        />
        <input
          type="number"
          disabled={!selected}
          onChange={(e) => changeOffset(obj.id, Number(e.target.value))}
          placeholder="0"
          min="-12"
          max="12"
          className="text-cyan-200 text-center rounded-full bg-neutral-900 text-sm py-0.5"
        />
      </label>
    );
  } else {
    throw new Error("state is not initialized");
  }
}
