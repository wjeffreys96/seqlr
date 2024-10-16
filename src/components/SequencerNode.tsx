import { AudioContextType, NoteObject } from "../@types/AudioContext";
import { useContext, memo, CSSProperties } from "react";
import { cn } from "../utils/utils.ts";
import { audioCtx } from "../AudioContext.ctx";

const SequencerNode = memo(function SequencerNode({
  obj,
  columnIsPlaying,
  outerIndex,
  style,
}: {
  obj: NoteObject;
  columnIsPlaying: boolean;
  outerIndex: number;
  style: CSSProperties;
}) {
  const actx: AudioContextType = useContext(audioCtx);
  const { toggleNotePlaying, changeOffset } = actx;

  if (toggleNotePlaying && changeOffset) {
    const objId = obj.id !== 0 ? obj.id * 100 : obj.id;
    const offsetPositive =
      Math.sign(obj.offset) > -1 && obj.offset !== 0 ? true : false;

    return (
      <div style={style} className="flex items-center pt-2">
        <label
          htmlFor={String("cbi" + objId + outerIndex)}
          key={String("cbk" + obj.id)}
          className={cn(
            "mx-2 min-w-16 bg-neutral-800 border-neutral-500 cursor-pointer flex lg:h-20 lg:w-16 md:w-12",
            "w-8 justify-center text-center text-blue-300 flex-col pb-2 pt-1 px-1 rounded-lg",
            "ease-in-out transition-transform",
            columnIsPlaying ? "-translate-y-1 border" : "hover:bg-cyan-950",
            obj.isPlaying && "bg-cyan-900",
          )}
        >
          {<span className="text-white mb-2">{obj.id + 1}</span>}
          <input
            className="my-2 hidden"
            id={String("cbi" + objId + outerIndex)}
            onChange={() => {
              toggleNotePlaying(obj.id, outerIndex);
            }}
            type="checkbox"
          />
          <label
            className={cn(
              "cursor-text",
              obj.offset != 0 ? "text-cyan-200" : "text-neutral-400",
              "text-center rounded-full bg-neutral-900 text-sm py-0.5",
            )}
          >
            <span
              className={cn("text-xs", offsetPositive && "ml-px mr-[-2px]")}
            >
              {offsetPositive && "+"}
            </span>
            <input
              className={cn(
                "max-w-4",
                "cursor-text text-center text-inherit bg-transparent",
              )}
              name={"Node" + objId}
              type="number"
              onChange={(e) => {
                changeOffset(obj.id, Number(e.target.value), outerIndex);
              }}
              value={obj.offset}
              min="-12"
              max="12"
            />
          </label>
        </label>
      </div>
    );
  } else {
    throw new Error("state is not initialized");
  }
});

export default SequencerNode;
