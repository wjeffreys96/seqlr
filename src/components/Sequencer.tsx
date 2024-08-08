import { useContext, useEffect, useRef, useState } from "react";
import { cn } from "../utils/cn.ts";
import { audioCtx } from "../AudioContext.ctx.tsx";
import type { AudioContextType, SequencerObject } from "../@types/AudioContext";
import { NoteObject } from "../@types/AudioContext";
import SequencerNode from "./SequencerNode";
import KnobModule from "./KnobModule";

export default function Sequencer() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, dispatch } = actx;
  const seqRefArr = useRef<(HTMLDivElement | null)[]>([]);
  const globXScrollRef = useRef<HTMLDivElement | null>(null);
  const [scrollWidth, setScrollWidth] = useState<number>(
    seqRefArr.current[0]?.scrollWidth || 0,
  );
  const [scrollContainerWidth, setScrollContainerWidth] = useState<number>(
    seqRefArr.current[0]?.offsetWidth || 0,
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

  if (state && dispatch) {
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
    } = state;

    if (globSeqArr.length > 0) {
      return (
        <>
          {seqRefArr.current[0] && (
            <div className="flex flex-col justify-center pb-[1px] gap-4 mx-1.5 px-4 h-4">
              <div
                ref={globXScrollRef}
                onScroll={handleXScroll}
                style={{ width: `${scrollContainerWidth}px` }}
                className="overflow-x-scroll scrollbar-thin scrollbar-track-neutral-700 w-full h-full"
              >
                <div
                  className="h-[1px]"
                  style={{ width: `${scrollWidth}px` }}
                />
              </div>
            </div>
          )}
          {globSeqArr.map((arr, outerIndex) => {
            return (
              <div
                key={"gnak" + outerIndex}
                className="flex flex-col gap-4 mx-1.5 my-2 bg-neutral-800 p-4 rounded-lg border border-neutral-700"
              >
                <KnobModule outerIndex={outerIndex} />
                <div
                  ref={(el) => {
                    seqRefArr.current[outerIndex] = el;
                  }}
                  className={cn(
                    "flex scrollbar-thumb-neutral-600 scrollbar-thin overflow-auto bg-neutral-900 p-5 rounded-xl ",
                  )}
                >
                  {arr.innerArr.map((obj: NoteObject) => {
                    const columnIsPlaying =
                      (masterPlaying && obj.id === currentNote - 1) ||
                      (masterPlaying &&
                        currentNote === 0 &&
                        obj.id === nodeCount - 1);
                    return (
                      <div className="flex" key={"iadk" + obj.id}>
                        <SequencerNode
                          key={"snk" + obj.id}
                          obj={obj}
                          outerIndex={outerIndex}
                          columnIsPlaying={columnIsPlaying}
                        />
                        {(obj.id + 1) % 16 === 0 && (
                          <>
                            <span className="m-1 my-2 border-l border-neutral-700" />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      );
    }
  } else {
    throw new Error("actx is undefined");
  }
}
