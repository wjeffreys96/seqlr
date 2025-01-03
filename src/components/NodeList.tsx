import { forwardRef, useRef, useCallback, memo } from "react";
import { cn } from "../utils/utils.ts";
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

const NodeList = memo(forwardRef<List<NoteObject[]>[] | [], NodeListProps>(
  ({ arr, outerIndex, handleScroll }, ref) => {
    const actx = useContext<AudioContextType>(audioCtx);
    const {
      followEnabled,
      currentNote,
      nodeCount,
      scrollLocked,
    } = actx.state!;
    const listRef = useRef<List<NoteObject[]> | null>(null);

    const updateRef = useCallback((el: List<NoteObject[]>) => {
      if (ref && el) {
        if (typeof ref === "function") {
          return;
        } else {
          if (ref.current) {
            ref.current[outerIndex] = el;
            if (ref.current[outerIndex] && followEnabled) {
              ref.current[outerIndex].scrollToItem(currentNote, "smart");
            }
          }
        }
      }
    }, [currentNote, followEnabled, outerIndex, ref])

    const InnerArrItem = useCallback(
      ({ index, style }: ListChildComponentProps<NoteObject[]>) => {
        const obj = arr.innerArr[index];
        const columnIsPlaying =
          (obj.id === currentNote - 1) ||
          (currentNote === 0 && obj.id === nodeCount - 1);
        return (
          <SequencerNode
            style={style}
            obj={obj}
            outerIndex={outerIndex}
            columnIsPlaying={columnIsPlaying}
          />
        )
      },
      [outerIndex, arr, currentNote, nodeCount],
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
              ref={(el: List<NoteObject[]>) => {
                listRef.current = el;
                updateRef(listRef.current);
              }}
              onScroll={() => {
                if (listRef.current && scrollLocked) {
                  handleScroll((listRef.current.state as { scrollOffset: number }).scrollOffset);
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
                "px-1 scrollbar-thin bg-zinc-900 rounded-lg",
              )}
              overscanCount={5}
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
));

NodeList.displayName = "NodeList";

export default NodeList;
