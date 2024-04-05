import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { audioCtx } from "../AudioContext";
import { getAdjustedFrequencyBySemitone, noteFreqs } from "../utils/utils";
import type {
  ActxStateType,
  AudioContextType,
  NoteObject,
} from "../@types/AudioContext.d.ts";

interface StateRef {
  tempo: number;
  currentNote: number;
  currentRoot: string;
  selectedBoxes: NoteObject[] | [];
  rhythmResolution: number;
}

let timerID: number;

export default function Scheduler({
  selectedBoxes,
}: {
  selectedBoxes: NoteObject[];
}) {
  const actx: AudioContextType = useContext<AudioContextType>(audioCtx);
  const { state, playTone, dispatch } = actx;
  const {
    masterPlaying,
    engine,
    currentNote,
    rhythmResolution,
    currentRoot,
  }: ActxStateType = state!;
  const BpmNumRef = useRef<HTMLInputElement>(null);
  const [tempo, setTempo] = useState<number>(120);
  const lookahead = 25; // How frequently to call scheduling function (ms)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime: number; // When next note is due

  // access state via ref while inside loop to avoid stale state.
  const stateRef: MutableRefObject<StateRef> = useRef<StateRef>({
    tempo,
    currentNote,
    selectedBoxes,
    rhythmResolution,
    currentRoot,
  });

  const nextNote = () => {
    if (dispatch) {
      // Advance current note and time by a 16th note
      const secondsPerBeat =
        60.0 / stateRef.current.tempo / stateRef.current.rhythmResolution;
      nextNoteTime += secondsPerBeat;
      dispatch({
        type: "SETCURRENTNOTE",
        payload: stateRef.current.currentNote + 1,
      });
    }
  };

  const scheduleNote = (time: number) => {
    if (playTone) {
      // Check if the current note is selected to be played by the sequencer
      const selectedInSequencer = stateRef.current.selectedBoxes.find((obj) => {
        return obj.id === stateRef.current.currentNote;
      });
      if (selectedInSequencer) {
        const currentNoteFreq = getAdjustedFrequencyBySemitone(
          selectedInSequencer.offset,
          noteFreqs[stateRef.current.currentRoot][3],
        );
        if (currentNoteFreq) {
          playTone({
            type: "sine",
            freq: currentNoteFreq,
            duration: 0.3,
            time,
          });
        } else {
          console.error("currentNoteFreq is undefined");
        }
      }
    }
  };

  const scheduler = () => {
    // if theres a note to be played in the future, schedule it and move on to the next note
    if (engine) {
      while (nextNoteTime < engine.currentTime + scheduleAheadTime) {
        scheduleNote(nextNoteTime);
        nextNote();
      }
      // check for notes to schedule again in (lookahead) milliseconds
      timerID = setTimeout(scheduler, lookahead);
    }
  };

  const play = () => {
    if (engine) {
      nextNoteTime = engine.currentTime;
      scheduler();
    }
  };

  // trigger play() when user presses play button or stop when user presses pause
  useEffect(() => {
    if (masterPlaying) {
      play();
    } else {
      clearTimeout(timerID);
    }
  }, [masterPlaying]); // eslint-disable-line

  // update ref whenever state changes
  useEffect(() => {
    stateRef.current = {
      tempo,
      currentNote,
      selectedBoxes,
      rhythmResolution,
      currentRoot,
    };
  }, [tempo, currentNote, selectedBoxes, rhythmResolution, currentRoot]);

  return (
    <form
      className="flex justify-between items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
        setTempo(Number(BpmNumRef.current!.value));
        BpmNumRef.current?.blur();
      }}
    >
      <label className="flex items-center justify-center gap-2 text-left text-zinc-300 text-sm">
        BPM:
        <div>
          <input
            value={tempo}
            name="bpm"
            step="1"
            onChange={(e) => {
              e.preventDefault();
              setTempo(Number(e.target.value));
            }}
            ref={BpmNumRef}
            type="number"
            className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-14 text-sm"
          />
        </div>
      </label>
    </form>
  );
}
