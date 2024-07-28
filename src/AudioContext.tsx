import { useEffect, useReducer } from "react";
import { audioCtx } from "./AudioContext.ctx";
import {
  OscParams,
  AudioContextType,
  ActxStateType,
  SequencerObject,
} from "./@types/AudioContext";

let init: boolean, globSeqArrInit: boolean;

const initialState: ActxStateType = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  currentNote: 0,
  rhythmResolution: 2,
  currentRoot: "C",
  attack: 0.03,
  release: 0.03,
  tempo: 120,
  sequencerCount: 3,
  nodeCount: 16,
  globSeqArr: [],
};

interface Action {
  type: string;
  payload?: unknown;
}

const reducer = (state: ActxStateType, action: Action): ActxStateType => {
  switch (action.type) {
    case "TOGGLEMASTERPLAYING":
      return { ...state, masterPlaying: !state.masterPlaying };

    case "SETENGINE":
      if (action.payload instanceof AudioContext) {
        return { ...state, engine: action.payload };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETMASTERVOL":
      if (action.payload instanceof GainNode) {
        return { ...state, masterVol: action.payload };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETCURRENTNOTE":
      if (typeof action.payload === "number") {
        return {
          ...state,
          currentNote: action.payload < state.nodeCount ? action.payload : 0,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETRHYTHMRESOLUTION":
      if (typeof action.payload === "number") {
        return {
          ...state,
          rhythmResolution: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETSEQUENCERCOUNT":
      if (typeof action.payload == "number") {
        return {
          ...state,
          sequencerCount: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETNODECOUNT":
      if (typeof action.payload == "number") {
        return {
          ...state,
          nodeCount: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETCURRENTROOT":
      if (typeof action.payload === "string") {
        return {
          ...state,
          currentRoot: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETATTACK":
      if (typeof action.payload === "number") {
        return {
          ...state,
          attack: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETRELEASE":
      if (typeof action.payload === "number") {
        return {
          ...state,
          release: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETTEMPO":
      if (typeof action.payload === "number") {
        return {
          ...state,
          tempo: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETGLOBSEQARR": {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          globSeqArr: action.payload,
        };
      } else {
        throw new Error("Payload must be an array");
      }
    }
    default:
      return state;
  }
};

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { sequencerCount, nodeCount, globSeqArr } = state;

  useEffect(() => {
    if (!globSeqArrInit) {
      // initialize sequencers
      const outerArr = [];
      for (let index = 0; index < sequencerCount; index++) {
        const innerArr = [];
        for (let index = 0; index < nodeCount; index++) {
          innerArr.push({ id: index, offset: 0, isPlaying: false });
        }
        outerArr.push({
          attack: 0.03,
          release: 0.1,
          gain: null,
          octave: 3,
          waveform: "sine",
          innerArr,
        });
      }
      dispatch({ type: "SETGLOBSEQARR", payload: outerArr });

      globSeqArrInit = true;
    } else {
      if (sequencerCount > globSeqArr.length) {
        const copiedGlobSeqArr: SequencerObject[] = globSeqArr;
        for (
          let index = 0;
          index < sequencerCount - copiedGlobSeqArr.length;
          index++
        ) {
          const innerArr = [];
          for (let index = 0; index < nodeCount; index++) {
            innerArr.push({ id: index, offset: 0, isPlaying: false });
          }
          console.log(
            copiedGlobSeqArr.push({
              attack: 0.03,
              release: 0.1,
              gain: null,
              octave: 3,
              waveform: "sine",
              innerArr,
            }),
          );
        }

        dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
      } else if (sequencerCount < globSeqArr.length) {
        console.error("Not implemented yet!");
      }
    }
  }, [globSeqArr, sequencerCount, nodeCount]);

  const playTone = ({ freq, duration, time, seqOpts }: OscParams) => {
    if (state.engine && state.masterVol) {
      // grab a ref to the main audio engine
      const eng: AudioContext = state.engine;

      // create the oscillator that will play the tone
      const osc: OscillatorNode = eng.createOscillator();

      // create a gain node to control the tone's envelope
      const gain: GainNode = eng.createGain();

      // we can't actually start at 0 so we start the gain node at the lowest level we can
      gain.gain.setValueAtTime(0.01, time);

      // set attack
      gain.gain.linearRampToValueAtTime(1, time + seqOpts.attack);

      // connect envelope gainNode to the gainNode on the specified sequencer
      gain.connect(seqOpts.volume);

      // connect the oscillator to the gain node
      osc.connect(gain);

      // set waveform type
      osc.type = seqOpts.waveform;

      // set pitch
      osc.frequency.value = freq;

      // begin playing the note
      osc.start(time);

      // set release
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        time + duration + seqOpts.release,
      );

      // stop playing the note
      osc.stop(time + duration + seqOpts.release);
    } else {
      throw new Error("Actx state not initialized");
    }
  };

  const toggleNotePlaying = (id: number, index: number) => {
    const newArr = state.globSeqArr;
    const innerArr = newArr[index].innerArr;
    const foundNote = innerArr.find((obj) => {
      return obj.id === id;
    });
    if (foundNote) {
      foundNote.isPlaying = !foundNote.isPlaying;
      dispatch({
        type: "SETGLOBSEQARR",
        payload: newArr,
      });
    } else {
      throw new Error("note not found");
    }
  };

  const changeOffset = (id: number, offset: number, index: number) => {
    const newArr = state.globSeqArr;
    const innerArr = newArr[index].innerArr;
    const foundNote = innerArr.find((obj) => {
      return obj.id === id;
    });
    if (foundNote) {
      foundNote.offset = offset;
      dispatch({ type: "SETGLOBSEQARR", payload: newArr });
    } else {
      throw new Error("note not found");
    }
  };

  const toggleMasterPlayPause = () => {
    // first time user presses play we initialize audio engine (autoplay policy)
    if (!init) {
      // create the audio engine and master volume channel
      const engine: AudioContext = new AudioContext();
      const masterVol = engine.createGain();
      masterVol.connect(engine.destination);

      // create gainNodes for each sequencer and set volume on each
      const copiedGlobSeqArr = state.globSeqArr;
      copiedGlobSeqArr.forEach((el) => {
        el.gain = engine.createGain();
        el.gain.gain.value = 0.5;
        el.gain.connect(masterVol);
      });

      // save to state
      dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
      dispatch({ type: "SETENGINE", payload: engine });
      dispatch({ type: "SETMASTERVOL", payload: masterVol });

      // we only need to do this the very first time the user hits play
      init = true;
    }
    dispatch({ type: "SETCURRENTNOTE", payload: 0 });
    dispatch({ type: "TOGGLEMASTERPLAYING" });
  };

  const actxVal: AudioContextType = {
    dispatch,
    playTone,
    toggleMasterPlayPause,
    toggleNotePlaying,
    changeOffset,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
