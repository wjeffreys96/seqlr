import { createContext, useReducer } from "react";
import {
  OscParams,
  AudioContextType,
  ActxStateType,
  NoteObject,
} from "./@types/AudioContext";

let init: boolean;

const initialState: ActxStateType = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  currentNote: 0,
  rhythmResolution: 2,
  currentRoot: "C",
  selectedBoxes: [],
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

    case "SETCURRENTROOT":
      if (typeof action.payload === "string") {
        return {
          ...state,
          currentRoot: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }

    case "SETSELECTEDBOXES": {
      if (action.payload) {
        const newBoxes = action.payload as NoteObject;
        return {
          ...state,
          selectedBoxes: [...state.selectedBoxes, newBoxes],
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }
    }
    default:
      return state;
  }
};
export const audioCtx: React.Context<AudioContextType | object> = createContext<
  AudioContextType | object
>({});

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const playTone = ({ type, freq, duration, time }: OscParams) => {
    if (state.engine && state.masterVol) {
      const eng: AudioContext = state.engine;
      const osc: OscillatorNode = eng.createOscillator();
      const gain: GainNode = eng.createGain();
      gain.gain.setValueAtTime(1, time);
      gain.connect(state.masterVol);
      osc.connect(gain);
      osc.type = type;
      osc.frequency.value = freq;
      osc.start(time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
      osc.stop(time + duration);
    } else {
      throw new Error("Actx state not initialized");
    }
  };

  const toggleMasterPlayPause = () => {
    // first time user presses play we initialize audio engine and save it to state.
    if (!init) {
      // create the audio engine and master volume channel and save them.
      const engine = new AudioContext();
      const masterVol = engine.createGain();
      masterVol.connect(engine.destination);

      dispatch({ type: "SETENGINE", payload: engine });
      dispatch({ type: "SETMASTERVOL", payload: masterVol });

      // play silent buffer to unlock audio - otherwise clicking may happen.
      const silentBuffer = engine.createBuffer(1, 1, 22050);
      const node = engine.createBufferSource();
      node.buffer = silentBuffer;
      node.start(0);

      init = true;
    }
    dispatch({ type: "SETCURRENTNOTE", payload: 0 });
    dispatch({ type: "TOGGLEMASTERPLAYING" });
  };

  const spliceSelectedBoxes = (index: number) => {
    const boxes = state.selectedBoxes;
    boxes.splice(index, 1);
    dispatch({ type: "SETSELECTEDBOXES", payload: boxes });
  };

  const actxVal: AudioContextType = {
    dispatch,
    playTone,
    toggleMasterPlayPause,
    spliceSelectedBoxes,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
