import { forwardRef, useCallback } from "react";
import { cn } from "../utils/cn";
import { SequencerObject, NoteObject } from "../@types/AudioContext";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import SequencerNode from "./SequencerNode";
import { useContext } from "react";
import { audioCtx } from "../AudioContext.ctx";
import { AudioContextType } from "../@types/AudioContext";

interface NodeListProps {
  arr: SequencerObject;
  outerIndex: number;
  handleScroll: (scrollPos: number) => void;
}

const NodeList = forwardRef<List<NoteObject>[] | [], NodeListProps>(
  ({ arr, outerIndex, handleScroll }, ref) => {
    const actx = useContext<AudioContextType>(audioCtx);
    const {
      followEnabled,
      masterPlaying,
      currentNote,
      nodeCount,
      scrollLocked,
    } = actx.state!;

    const getRef = (el: List) => {
      if (ref) {
        if (typeof ref === "function") {
          return;
        } else {
          if (ref.current) {
            ref.current[outerIndex] = el;
            if (ref.current[outerIndex] && followEnabled) {
              ref.current[outerIndex].scrollToItem(currentNote, "center");
            }
          }
        }
      }
    };

    const InnerArrItem = useCallback(
      ({ index, style }: ListChildComponentProps) => {
        const obj = arr.innerArr[index];
        const columnIsPlaying =
          (masterPlaying && obj.id === currentNote - 1) ||
          (masterPlaying && currentNote === 0 && obj.id === nodeCount - 1);
        return (
          <SequencerNode
            style={style}
            obj={obj}
            outerIndex={outerIndex}
            columnIsPlaying={columnIsPlaying}
          />
        );
      },
      [outerIndex, arr, masterPlaying, currentNote, nodeCount],
    );

    const itemKey = useCallback(
      (index: number, data: NoteObject[]) => {
        const item = data[index];
        return `snak-${item.id}-${outerIndex}`;
      },
      [outerIndex],
    );

    return (
      <div className="h-full">
        <AutoSizer>
          {({ height, width }: { height: number; width: number }) => (
            <List
              ref={getRef}
              onScroll={() => {
                if (ref && typeof ref !== "function") {
                  if (ref.current) {
                    if (ref.current[outerIndex] && scrollLocked) {
                      handleScroll(
                        (ref.current[outerIndex].state as any).scrollOffset,
                      );
                    }
                  }
                }
              }}
              layout="horizontal"
              height={height}
              width={width}
              itemCount={arr.innerArr.length}
              itemSize={72}
              className={cn(
                followEnabled
                  ? "scrollbar-thumb-neutral-900"
                  : "scrollbar-thumb-neutral-600",
                "scrollbar-thin bg-zinc-900 rounded-lg",
              )}
              overscanCount={7}
              itemData={arr.innerArr}
              itemKey={itemKey}
            >
              {InnerArrItem}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  },
);

export default NodeList;
