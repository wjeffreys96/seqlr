import {
  useEffect,
  ComponentState,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
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
  scrollPos: number;
  setScrollPos: React.Dispatch<SetStateAction<number>>;
}
export default function NodeList({
  arr,
  outerIndex,
  scrollPos,
  setScrollPos,
}: NodeListProps) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { followEnabled, masterPlaying, currentNote, nodeCount } = actx.state!;
  const nodeListRef = useRef<List<NoteObject[]> | null>(null);

  useEffect(() => {
    if (nodeListRef.current) {
    }
  }, []);

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
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <List
          ref={(el) => {
            nodeListRef.current = el;
            if (nodeListRef.current) {
              console.log(nodeListRef.current.state);
              if (followEnabled) {
                nodeListRef.current.scrollToItem(currentNote, "center");
              } else {
                nodeListRef.current.scrollTo(scrollPos);
              }
            }
          }}
          layout="horizontal"
          onScroll={() => {
            nodeListRef.current &&
              setScrollPos(
                (nodeListRef.current.state as ComponentState).scrollOffset,
              );
          }}
          height={height}
          width={width}
          itemCount={arr.innerArr.length}
          itemSize={73}
          className="scrollbar-thin"
          overscanCount={2}
          itemData={arr.innerArr}
          itemKey={itemKey}
        >
          {InnerArrItem}
        </List>
      )}
    </AutoSizer>
  );
}
