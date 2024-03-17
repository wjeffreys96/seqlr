import { NoteObject } from "../@types/Sequencer";

export default function SequencerNode({
  obj,
  columnStyles,
  handleChangeCheckbox,
  handleChangeOffset,
}: {
  obj: NoteObject;
  columnStyles: string;
  handleChangeCheckbox: (obj: NoteObject) => void;
  handleChangeOffset: (obj: NoteObject) => void;
}) {
  return (
    <label
      htmlFor={String("cbi" + obj.id)}
      key={String("cbk" + obj.id)}
      className={columnStyles}
    >
      {<span className="text-white">{obj.id + 1}</span>}
      <input
        className="my-2"
        id={String("cbi" + obj.id)}
        onChange={() => handleChangeCheckbox(obj)}
        type="checkbox"
      />
      <input
        type="number"
        onChange={(e) =>
          handleChangeOffset({
            id: obj.id,
            offset: Number(e.target.value),
          })
        }
        placeholder="0"
        min="-12"
        max="12"
        className="text-cyan-200 text-center rounded-full bg-neutral-900 text-sm py-0.5"
      />
    </label>
  );
}
