import { useCallback } from "react";
import { SequencerObject, NoteObject } from "../@types/AudioContext";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import SequencerNode from "./SequencerNode";

interface NodeListProps {
  arr: SequencerObject;
  outerIndex: number;
  masterPlaying: boolean;
  nodeCount: number;
  currentNote: number;
}

export default function NodeList({
  arr,
  outerIndex,
  masterPlaying,
  nodeCount,
  currentNote,
}: NodeListProps) {
  const InnerArr = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const obj = arr.innerArr[index];
      const columnIsPlaying =
        (masterPlaying && obj.id === currentNote - 1) ||
        (masterPlaying && currentNote === 0 && obj.id === nodeCount - 1);
      return (
        <div style={style} className="flex items-center">
          <SequencerNode
            obj={obj}
            outerIndex={outerIndex}
            columnIsPlaying={columnIsPlaying}
          />
        </div>
      );
    },
    [arr.innerArr, masterPlaying, currentNote, nodeCount, outerIndex],
  );

  const itemKey = useCallback((index: number, data: NoteObject[]) => {
    const item = data[index];
    return `${item.id}-${item.isPlaying}`;
  }, []);

  return (
    <List
      layout="horizontal"
      height={94}
      width={1900}
      itemCount={arr.innerArr.length}
      itemSize={73}
      className="scrollbar-thin"
      overscanCount={2}
      itemData={arr.innerArr}
      itemKey={itemKey}
    >
      {InnerArr}
    </List>
  );
}
