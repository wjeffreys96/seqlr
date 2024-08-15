import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn.ts";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType, SequencerObject } from "../@types/AudioContext";
import KnobModule from "./KnobModule";
import NodeList from "./NodeList.tsx";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

export default function Sequencer() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state } = actx;
  const seqRefArr = useRef<(HTMLDivElement | null)[]>([]);
  const globXScrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollWidth, setScrollWidth] = useState<number>(
    seqRefArr.current[0]?.scrollWidth ?? 0,
  );
  const [scrollContainerWidth, setScrollContainerWidth] = useState<number>(
    seqRefArr.current[0]?.offsetWidth ?? 0,
  );

  useEffect(() => {
    if (seqRefArr.current[0]) {
      setScrollWidth(seqRefArr.current[0].scrollWidth);
      setScrollContainerWidth(seqRefArr.current[0].offsetWidth);
    }
  }, [state]);

  const handleXScroll = () => {
    const scrollBar = globXScrollRef.current;
    seqRefArr.current.forEach((el) => {
      if (el && scrollBar) {
        el.scroll({
          left: scrollBar.scrollLeft,
          behavior: "auto",
        });
      }
    });
  };

  const itemKey = useCallback((index: number, arr: SequencerObject[]) => {
    const item = arr[index];
    return `gsak-${item.id}-${index}`;
  }, []);

  const {
    currentNote,
    masterPlaying,
    globSeqArr,
    nodeCount,
  }: {
    currentNote: number;
    masterPlaying: boolean;
    globSeqArr: SequencerObject[];
    nodeCount: number;
  } = state!;

  const SequencerList = useCallback(
    ({ style, index }: ListChildComponentProps) => {
      if (globSeqArr.length > 1) {
        return (
          <div
            style={style}
            className="flex flex-col gap-4 mx-1.5 my-2 bg-neutral-800 p-4 rounded-lg border border-neutral-700"
          >
            <KnobModule outerIndex={index} />
            <div className={cn("flex bg-neutral-900 p-3 rounded-xl ")}>
              <NodeList
                arr={globSeqArr[index]}
                outerIndex={index}
                masterPlaying={masterPlaying}
                nodeCount={nodeCount}
                currentNote={currentNote}
              />
            </div>
          </div>
        );
      }
    },
    [globSeqArr, currentNote, masterPlaying],
  );
  if (globSeqArr.length > 0) {
    return (
      <>
        {seqRefArr.current[0] && (
          <div className="flex flex-col justify-center pb-[1px] gap-4 mx-1.5 px-4 lg:h-4 lg:bg-inherit bg-neutral-800 rounded-lg h-8 ">
            <div
              ref={globXScrollRef}
              onScroll={handleXScroll}
              style={{ maxWidth: `${scrollContainerWidth}px` }}
              className="overflow-x-scroll scrollbar-thin scrollbar-track-neutral-700 w-full h-full"
            >
              <div className="h-[1px]" style={{ width: `${scrollWidth}px` }} />
            </div>
          </div>
        )}

        <List
          className="scrollbar-thin"
          height={880}
          width={1910}
          itemCount={globSeqArr.length}
          itemSize={210}
          itemData={globSeqArr}
          itemKey={itemKey}
        >
          {SequencerList}
        </List>
      </>
    );
  }
}
