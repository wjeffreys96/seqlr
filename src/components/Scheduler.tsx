import { useContext, useEffect, useState } from "react";
import { audioCtx, AudioContextType } from "../AudioContext";

interface Note {
  note: number;
  time: number;
}

export default function Scheduler({ freq }: { freq: number }) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, playTone } = actx;
  const { masterPlaying, engine } = state;
  const [timerID, setTimerId] = useState<number | undefined>(0);

  let tempo = 120;
  let currentNote: number = 0;
  let lookahead = 25.0; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime = 0.0; // When next note is due
  let notesInQueue: Array<Note> = [];

  const nextNote = () => {
    // Advance current note and time by a 16th note...
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime += secondsPerBeat;

    currentNote++; // increment beat counter

    if (currentNote === 16) {
      currentNote = 0;
    } // wrap to zero
  };

  const scheduleNote = (notes: Note) => {
    notesInQueue.push(notes);
    playTone({ type: "sine", freq: freq, duration: 100 });
    notesInQueue.shift();
  };

  const scheduler = () => {
    while (nextNoteTime < engine.currentTime + scheduleAheadTime) {
      const params: Note = { note: currentNote, time: nextNoteTime };
      scheduleNote(params);
      nextNote();
    }
    setTimerId(setTimeout(scheduler, lookahead));
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

  return <></>;
}
