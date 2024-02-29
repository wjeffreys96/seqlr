import {
  useContext,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { audioCtx, AudioContextType } from "../AudioContext";

let timerID: number;

export default function Scheduler({
  freqVal,
  setFreqVal,
}: {
  freqVal: number;
  setFreqVal: Dispatch<SetStateAction<number>>;
}) {
  console.log("Rendering Scheduler...");
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, playTone } = actx;
  const { masterPlaying, engine } = state;

  let currentNote: number = 0;
  let lookahead = 25; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime: number; // When next note is due

  const BpmNumRef = useRef<HTMLInputElement>(null);

  const [tempo, setTempo] = useState<number>(120);

  console.log(freqVal, tempo);

  const nextNote = () => {
    // Advance current note and time by a 16th note
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += secondsPerBeat;
    currentNote++; // increment beat counter
    if (currentNote === 16) {
      currentNote = 0;
    } // wrap to zero
  };

  const scheduleNote = (time: number) => {
    playTone({ type: "sine", freq: freqVal, duration: 0.1, time });
  };

  const scheduler = () => {
    while (nextNoteTime < engine.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTime);
      nextNote();
    }
    timerID = setTimeout(scheduler, lookahead);
  };

  const play = () => {
    currentNote = 0;
    nextNoteTime = engine.currentTime;
    scheduler();
  };

  useEffect(() => {
    if (masterPlaying) {
      play();
    } else {
      clearTimeout(timerID);
    }
  }, [masterPlaying]);

  return (
    <form
      className="flex justify-between items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setTempo(Number(BpmNumRef.current!.value));
        BpmNumRef.current?.blur();
      }}
    >
      <label className="text-left text-zinc-300 text-sm" htmlFor="bpm">
        BPM:
      </label>
      {/* <input
          max={300}
          min={1}
          step={1}
          ref={BpmRef}
          value={tempo}
          onInput={handleBpmChange}
          type="range"
        /> */}
      <input
        value={tempo}
        step="1"
        onChange={(e) => {
          setTempo(Number(e.target.value));
        }}
        ref={BpmNumRef}
        type="number"
        className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-14 text-sm"
      />
    </form>
  );
}

// TODO allow changing note params while masterPlaying
