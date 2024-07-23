import { MutableRefObject, useContext, useEffect, useRef } from "react";
import { audioCtx } from "../AudioContext.ctx.tsx";
import { getAdjustedFrequencyBySemitone, noteFreqs } from "../utils/utils";
import type {
  ActxStateType,
  AudioContextType,
  SequencerObject,
} from "../@types/AudioContext.d.ts";
import InputWithLabel from "./InputWithLabel.tsx";

interface StateRef {
  tempo: number;
  currentNote: number;
  currentRoot: string;
  globSeqArr: SequencerObject[] | [];
  rhythmResolution: number;
}

let timerID: number;

export default function Scheduler({
  globSeqArr,
}: {
  globSeqArr: SequencerObject[];
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
    globSeqArr,
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
      stateRef.current.globSeqArr.forEach((element) => {
        const currNote = element.innerArr.find((obj) => {
          return obj.id === stateRef.current.currentNote;
        });

        if (currNote?.isPlaying) {
          const currentNoteFreq = getAdjustedFrequencyBySemitone(
            currNote.offset,
            noteFreqs[stateRef.current.currentRoot][element.octave],
          );
          if (currentNoteFreq) {
            if (element.gain) {
              const seqOpts = {
                attack: element.attack,
                release: element.release,
                volume: element.gain,
                waveform: element.waveform,
              };
              playTone({
                freq: currentNoteFreq,
                duration: 0.3,
                time,
                seqOpts,
              });
            } else {
              throw new Error("cannot access sequencer GainNode");
            }
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

  // toggle playing/stopping on user input
  useEffect(() => {
    if (masterPlaying) {
      play();
    } else {
      clearTimeout(timerID);
    }
    // adding play to dep array breaks the app !!
  }, [masterPlaying]); // eslint-disable-line

  // update ref whenever state changes
  useEffect(() => {
    if (state) {
      stateRef.current = {
        tempo,
        currentNote,
        globSeqArr,
        rhythmResolution,
        currentRoot,
      };
    } else {
      throw new Error("state is undefined");
    }
  }, [state, tempo, currentNote, globSeqArr, rhythmResolution, currentRoot]);
  if (state && dispatch) {
    return (
      <InputWithLabel
        labelText="BPM:"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({
            type: "SETTEMPO",
            payload: Number(BpmNumRef.current!.value),
          });
          BpmNumRef.current?.blur();
        }}
      >
        <input
          value={tempo}
          name="bpm"
          min={1}
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
          className="w-10 text-center rounded-full bg-inherit"
        />
      </InputWithLabel>
    );
  } else {
    throw new Error("actx not initialized");
  }
}
