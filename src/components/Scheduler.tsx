import { useContext, useEffect } from "react";
import { audioCtx, AudioContextType } from "../AudioContext";

let timerID: number;

export default function Scheduler({ freq }: { freq: number }) {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, playTone } = actx;
  const { masterPlaying, engine } = state;

  let tempo = 120;
  let currentNote: number = 0;
  let lookahead = 25; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime: number; // When next note is due

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
    playTone({ type: "sine", freq, duration: 0.1, time });
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

  return <></>;
}
