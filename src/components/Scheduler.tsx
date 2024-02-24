import { useContext, useEffect, useState } from "react";
import { audioCtx, AudioContextType } from "../AudioContext";

export default function Scheduler() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, dispatch } = actx;
  const { masterPlaying, engine } = state;
  let tempo = 120;
  let current16thNote: number;
  let startTime;
  const lookahead = 25.0; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime = 0.0; // When next note is due
  let noteResolution = 0; // 0 = 1/16th, 1 = 1/8th, 2 = 1/4 notes
  let notesInQueue = [];
  const webWorker = null;

  const nextNote = () => {
    // Advance current note and time by a 16th note...
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += 0.25 * secondsPerBeat;

    current16thNote++; // increment beat counter
    if (current16thNote === 16) {
      current16thNote = 0;
    } // wrap to zero
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    notesInQueue.push({ note: beatNumber, time });
    
  };

  return <h2>{masterPlaying && engine && engine.currentTime}</h2>;
}
