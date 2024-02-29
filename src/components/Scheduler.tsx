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

  const BpmRef = useRef<HTMLInputElement>(null);
  const BpmNumRef = useRef<HTMLInputElement>(null);

  const [tempo, setTempo] = useState<number>(120);
  const [tempoNumVal, setTempoNumVal] = useState<number>(120);

  console.log(freqVal, tempo);

  const handleBpmChange = () => {
    if (BpmRef.current) {
      setTempo(Number(BpmRef.current.value));
      setTempoNumVal(Number(BpmRef.current.value));
    }
  };

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
      className="flex justify-between gap-4 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setTempo(Number(tempoNumVal));
      }}
    >
      <label className="text-left text-zinc-300" htmlFor="bpm">
        BPM:
      </label>
      <div className="flex gap-4">
        <input
          max={300}
          min={1}
          step={1}
          ref={BpmRef}
          value={tempo}
          onInput={handleBpmChange}
          type="range"
        />
        <input
          value={tempoNumVal}
          step="1"
          onChange={(e) => {
            setTempoNumVal(Number(e.target.value));
          }}
          ref={BpmNumRef}
          type="number"
          className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-24 text-sm"
        />
      </div>
    </form>
  );
}

// TODO allow changing note params while masterPlaying
