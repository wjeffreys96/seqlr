import { useContext, useEffect } from "react";
import { audioCtx, AudioContextType, OscParams } from "../AudioContext";

interface Note {
  note: number;
  time: number;
}

export default function Scheduler() {
  const actx = useContext<AudioContextType>(audioCtx);
  const { state, playTone } = actx;
  const { masterPlaying, engine, masterVol } = state;

  let tempo = 120;
  let currentNote: number = 0;
  let lookahead = 25.0; // How frequently to call scheduling function (ms)
  let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime = 0.0; // When next note is due
  let noteResolution = 0; // 0 = 1/16th, 1 = 1/8th, 2 = 1/4 notes
  let notesInQueue: Array<Note> = [];
  let timerID;

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
    const { note, time } = notes;

    notesInQueue.push({ note: note, time });

    if (noteResolution === 1 && note % 2) {
      return; // skip non-8th 16th notes
    }

    if (noteResolution === 2 && note % 4) {
      return; // skip non-quarter 8th notes
    }

    const toneParams: OscParams = { type: "sine", freq: 440, duration: 100 };

    playTone(toneParams, engine, masterVol);
  };

  const scheduler = () => {
    if (engine && masterPlaying) {
      console.log("scheduling!");

      while (nextNoteTime < engine.currentTime + scheduleAheadTime) {
        const params: Note = { note: currentNote, time: nextNoteTime };
        scheduleNote(params);
        nextNote();
      }

      timerID = setTimeout(scheduler, lookahead);
    }
  };

  const play = () => {
    if (masterPlaying && engine) {
      console.log("Playing!");
      currentNote = 0;
      nextNoteTime = engine.currentTime;
      scheduler();
      // TODO start function
    } else {
      // TODO stop function
      return;
    }
  };

  useEffect(() => {
    if (masterPlaying) {
      play();
    } else return;
  }, [masterPlaying]);

  return <h2>{masterPlaying && engine && engine.currentTime}</h2>;
}
