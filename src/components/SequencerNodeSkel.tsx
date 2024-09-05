import { cn } from "../utils/cn";
import { CSSProperties } from "react";

export default function SequencerNodeSkel({ style }: { style: CSSProperties }) {
  return (
    <div style={style} className="flex items-center pt-2">
      <label
        className={cn(
          "mx-2 min-w-16 bg-neutral-800 border-neutral-500 cursor-pointer flex lg:h-20 lg:w-16 md:w-12",
          "w-8 justify-center text-center text-blue-300 flex-col pb-2 pt-1 px-1 rounded-lg",
          "ease-in-out transition-transform",
        )}
      >
        {<span className="text-white mb-2">0</span>}
        <label
          className={cn(
            "cursor-text text-neutral-400",
            "text-center rounded-full bg-neutral-900 text-sm py-0.5",
          )}
        >
          <input
            className={cn(
              "max-w-4",
              "cursor-text text-center text-inherit bg-transparent",
            )}
            name={"Node"}
            type="number"
            min="-12"
            max="12"
          />
        </label>
      </label>
    </div>
  );
}
