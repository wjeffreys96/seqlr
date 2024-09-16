import { useCallback, useContext, useRef } from "react";
import { cn } from "../utils/utils.ts";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType, NoteObject } from "../@types/AudioContext";
import KnobModule from "./KnobModule";
import NodeList from "./NodeList.tsx";
import { FixedSizeList as List } from "react-window";

export default function Sequencer() {
  console.log("Rendered Sequencer");
  const actx = useContext<AudioContextType>(audioCtx);
  const { globSeqArr } = actx.state!;

  const nodeListRef = useRef<List<NoteObject[]>[] | []>([]);

  const handleScroll = (scrollPos: number) => {
    nodeListRef.current.forEach((list) => {
      list.scrollTo(scrollPos);
    });
  };

  const itemKey = useCallback(
    (index: number, id: number) => {
      return `gsak-${id}-${index}`;
    },
    [],
  );

  if (globSeqArr.length > 0) {
    return (
      <>
        {globSeqArr.map((seq, index) => {
          return (
            <div
              key={itemKey(index, seq.id)}
              className={cn(
                "flex flex-col gap-3 h-48 mb-2",
                "bg-neutral-800 py-4 px-3 rounded-lg",
                "border border-neutral-700",
              )}
            >
              <KnobModule outerIndex={index} />
              <NodeList
                ref={nodeListRef}
                handleScroll={handleScroll}
                arr={seq}
                outerIndex={index}
              />
            </div>
          );
        })}
      </>
    );
  }
}
