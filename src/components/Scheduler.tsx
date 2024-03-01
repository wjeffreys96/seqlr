import { useContext, useEffect, useRef, useState } from "react";
import { audioCtx, AudioContextType } from "../AudioContext";

let timerID: number;

export default function Scheduler({ freqVal }: { freqVal: number }) {
  // console.log("Rendering Scheduler...");
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, playTone } = actx;
  const { masterPlaying, engine } = state;

  let currentNote: number = 0;
  let lookahead = 25; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime: number; // When next note is due

  const BpmNumRef = useRef<HTMLInputElement>(null);

  const [tempo, setTempo] = useState<number>(120);

  // access state via ref while inside loop to avoid stale state.
  const stateRef = useRef<{ tempo: number; freq: number }>({
    tempo,
    freq: freqVal,
  });

  const nextNote = () => {
    // Advance current note and time by a 16th note
    const secondsPerBeat = 60.0 / stateRef.current.tempo;
    nextNoteTime += secondsPerBeat;
    currentNote++; // increment beat counter
    if (currentNote === 16) {
      currentNote = 0;
    } // wrap to zero
  };

  const scheduleNote = (time: number) => {
    playTone({
      type: "sine",
      freq: stateRef.current.freq,
      duration: 0.1,
      time,
    });
  };

  const scheduler = () => {
    // if theres a note to be played in the future schedule it and move on to the next note
    while (nextNoteTime < engine.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTime);
      nextNote();
    }
    // check for notes to schedule again in (lookahead) milliseconds
    timerID = setTimeout(scheduler, lookahead);
  };

  const play = () => {
    currentNote = 0;
    nextNoteTime = engine.currentTime;
    scheduler();
  };

  // trigger play() when user presses play button or stop when user presses pause
  useEffect(() => {
    if (masterPlaying) {
      play();
    } else {
      clearTimeout(timerID);
    }
  }, [masterPlaying]);

  // update ref whenever state changes
  useEffect(() => {
    stateRef.current = { tempo, freq: freqVal };
  }, [tempo, freqVal]);

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
      <input
        value={tempo}
        step="1"
        onChange={(e) => {
          e.preventDefault();
          setTempo(Number(e.target.value));
        }}
        ref={BpmNumRef}
        type="number"
        className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-14 text-sm"
      />
    </form>
  );
}
