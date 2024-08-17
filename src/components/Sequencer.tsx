import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn.ts";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType, SequencerObject } from "../@types/AudioContext";
import KnobModule from "./KnobModule";
import NodeList from "./NodeList.tsx";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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
    sequencerCount,
    nodeCount,
  }: {
    currentNote: number;
    masterPlaying: boolean;
    globSeqArr: SequencerObject[];
    sequencerCount: number;
    nodeCount: number;
  } = state!;

  const SequencerList = useCallback(
    ({ style, index }: ListChildComponentProps) => {
      return (
        <div
          style={style}
          className="max-h-48 mb-2 flex flex-col gap-3 bg-neutral-800 py-3 px-3 rounded-lg border border-neutral-700"
        >
          <KnobModule outerIndex={index} />
          <div className={cn("flex h-full bg-neutral-900 p-2 rounded-xl ")}>
            <div className="flex-auto">
              <NodeList
                arr={globSeqArr[index]}
                outerIndex={index}
                masterPlaying={masterPlaying}
                nodeCount={nodeCount}
                currentNote={currentNote}
              />
            </div>
          </div>
        </div>
      );
    },
    [globSeqArr, currentNote, sequencerCount, nodeCount],
  );

  if (globSeqArr.length > 0) {
    return (
      <main className="min-h-custom">
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
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              className="scrollbar-thin scrollbar-thumb-neutral-500"
              height={height}
              width={width}
              itemCount={globSeqArr.length}
              itemSize={200}
              itemData={globSeqArr}
              itemKey={itemKey}
            >
              {SequencerList}
            </List>
          )}
        </AutoSizer>
      </main>
    );
  }
}
