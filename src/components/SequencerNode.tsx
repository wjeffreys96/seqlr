import { AudioContextType, NoteObject } from "../@types/AudioContext";
import { useState, useContext } from "react";
import { cn } from "../utils/cn";
import { audioCtx } from "../AudioContext.ctx";

export default function SequencerNode({
  obj,
  columnIsPlaying,
  outerIndex,
}: {
  obj: NoteObject;
  columnIsPlaying: boolean;
  outerIndex: number;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const [offsetPositive, setOffsetPositive] = useState<boolean>(false);
  const actx: AudioContextType = useContext(audioCtx);
  const { state, toggleNotePlaying, changeOffset } = actx;

  if (state && toggleNotePlaying && changeOffset) {
    // hack to ensure no duplicate ids
    const objId = obj.id !== 0 ? obj.id * 100 : obj.id;
    return (
      <label
        htmlFor={String("cbi" + objId + outerIndex)}
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
          id={String("cbi" + objId + outerIndex)}
          onChange={() => {
            toggleNotePlaying(obj.id, outerIndex);
            setSelected(!selected);
          }}
          type="checkbox"
        />
        <label className="cursor-text text-cyan-200 text-center rounded-full bg-neutral-900 text-sm py-0.5">
          <span className={cn("text-xs", offsetPositive && "ml-px mr-[-2px]")}>
            {offsetPositive ? "+" : ""}
          </span>
          <input
            className={cn(
              offsetPositive ? "max-w-4" : "",
              "cursor-text text-center text-inherit bg-transparent",
            )}
            name={"Node" + objId}
            type="number"
            onChange={(e) => {
              if (Math.sign(Number(e.target.value)) == 1) {
                setOffsetPositive(true);
              } else {
                setOffsetPositive(false);
              }
              changeOffset(obj.id, Number(e.target.value), outerIndex);
            }}
            placeholder="0"
            min="-12"
            max="12"
          />
        </label>
      </label>
    );
  } else {
    throw new Error("state is not initialized");
  }
}
