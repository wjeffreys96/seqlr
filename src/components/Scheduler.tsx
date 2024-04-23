import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
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
  globNoteArr: NoteObject[][] | [];
  rhythmResolution: number;
}

let timerID: number;

export default function Scheduler({
  globNoteArr,
}: {
  globNoteArr: NoteObject[][];
}) {
  const actx: AudioContextType = useContext<AudioContextType>(audioCtx);
  const { state, playTone, dispatch } = actx;
  const {
    masterPlaying,
    engine,
    currentNote,
    rhythmResolution,
    currentRoot,
    tempo,
  }: ActxStateType = state!;
  const BpmNumRef = useRef<HTMLInputElement>(null);
  const lookahead = 25; // How frequently to call scheduling function (ms)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
  let nextNoteTime: number; // When next note is due

  // access state via ref while inside loop to avoid stale state.
  const stateRef: MutableRefObject<StateRef> = useRef<StateRef>({
    tempo,
    currentNote,
    globNoteArr,
    rhythmResolution,
    currentRoot,
  });

  const nextNote = () => {
    if (dispatch) {
      const secondsPerBeat =
        60.0 / stateRef.current.tempo / stateRef.current.rhythmResolution;

      nextNoteTime += secondsPerBeat;

      dispatch({
        type: "SETCURRENTNOTE",
        payload: stateRef.current.currentNote + 1,
      });
    } else {
      throw new Error("dispatch is undefined");
    }
  };

  const scheduleNote = (time: number) => {
    if (playTone) {
      // Check if the current note is selected to be played by the sequencer
      stateRef.current.globNoteArr.forEach((element) => {
        const currNote = element.innerArr.find((obj) => {
          return obj.id === stateRef.current.currentNote;
        });
        if (currNote && currNote.isPlaying) {
          const currentNoteFreq = getAdjustedFrequencyBySemitone(
            currNote.offset,
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
            throw new Error("currentNoteFreq is undefined");
          }
        }
      });
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
    } else {
      throw new Error("engine is undefined");
    }
  };

  const play = () => {
    if (engine) {
      nextNoteTime = engine.currentTime;
      scheduler();
    } else {
      throw new Error("engine is undefined");
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
    if (state) {
      stateRef.current = {
        tempo,
        currentNote,
        globNoteArr,
        rhythmResolution,
        currentRoot,
      };
    } else {
      throw new Error("state is undefined");
    }
  }, [state, tempo, currentNote, globNoteArr, rhythmResolution, currentRoot]);
  if (state && dispatch) {
    return (
      <form
        className="flex justify-between items-center gap-2 w-full"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "SETTEMPO",
            payload: Number(BpmNumRef.current!.value),
          });
          BpmNumRef.current?.blur();
        }}
      >
        <label className="flex items-center justify-center gap-2 text-left text-zinc-200 text-sm">
          BPM:
          <div>
            <input
              value={tempo}
              name="bpm"
              step="1"
              onChange={(e) => {
                e.preventDefault();
                dispatch({
                  type: "SETTEMPO",
                  payload: Number(BpmNumRef.current!.value),
                });
              }}
              ref={BpmNumRef}
              type="number"
              className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-14 text-sm"
            />
          </div>
        </label>
      </form>
    );
  } else {
    throw new Error("actx not initialized");
  }
}
