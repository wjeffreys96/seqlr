import { useEffect, useReducer } from "react";
import { audioCtx } from "./AudioContext.ctx";
import {
  OscParams,
  AudioContextType,
  ActxStateType,
} from "./@types/AudioContext";

let init: boolean, globNoteArrInit: boolean;

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
  sequencerCount: 8,
  nodeCount: 32,
  globNoteArr: [],
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
          currentNote: action.payload < 16 ? action.payload : 0,
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

    case "SETGLOBNOTEARR": {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          globNoteArr: action.payload,
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

  // initialize sequencers
  useEffect(() => {
    if (!globNoteArrInit) {
      const outerArr = [];
      for (let index = 0; index < 4; index++) {
        const innerArr = [];
        for (let index = 0; index < 16; index++) {
          innerArr.push({ id: index, offset: 0, isPlaying: false });
        }
        outerArr.push({
          attack: 0.03,
          release: 0.03,
          gain: null,
          octave: 3,
          waveform: "sine",
          innerArr,
        });
      }
      dispatch({ type: "SETGLOBNOTEARR", payload: outerArr });
      globNoteArrInit = true;
    }
  }, []);

  const playTone = ({ freq, duration, time, seqOpts }: OscParams) => {
    if (state.engine && state.masterVol) {
      const eng: AudioContext = state.engine;
      const osc: OscillatorNode = eng.createOscillator();
      const gain: GainNode = eng.createGain();
      gain.gain.setValueAtTime(0.01, time);

      // set attack
      gain.gain.linearRampToValueAtTime(1, time + seqOpts.attack);

      // connect to the gainNode on the specified sequencer
      gain.connect(seqOpts.volume);
      osc.connect(gain);

      // set waveform type
      osc.type = seqOpts.waveform;

      // set pitch
      osc.frequency.value = freq;

      osc.start(time);

      // set release
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        time + duration + seqOpts.release,
      );
      osc.stop(time + duration + seqOpts.release);
    } else {
      throw new Error("Actx state not initialized");
    }
  };

  const toggleNotePlaying = (id: number, index: number) => {
    const newArr = state.globNoteArr;
    const innerArr = newArr[index].innerArr;
    const foundNote = innerArr.find((obj) => {
      return obj.id === id;
    });
    if (foundNote) {
      foundNote.isPlaying = !foundNote.isPlaying;
      dispatch({
        type: "SETGLOBNOTEARR",
        payload: newArr,
      });
    } else {
      throw new Error("note not found");
    }
  };

  const changeOffset = (id: number, offset: number, index: number) => {
    const newArr = state.globNoteArr;
    const innerArr = newArr[index].innerArr;
    const foundNote = innerArr.find((obj) => {
      return obj.id === id;
    });
    if (foundNote) {
      foundNote.offset = offset;
      dispatch({ type: "SETGLOBNOTEARR", payload: newArr });
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
      const copiedGlobNoteArr = state.globNoteArr;
      copiedGlobNoteArr.forEach((el) => {
        el.gain = engine.createGain();
        el.gain.gain.value = 0.5;
        el.gain.connect(masterVol);
      });

      // save to state
      dispatch({ type: "SETGLOBNOTEARR", payload: copiedGlobNoteArr });
      dispatch({ type: "SETENGINE", payload: engine });
      dispatch({ type: "SETMASTERVOL", payload: masterVol });

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
