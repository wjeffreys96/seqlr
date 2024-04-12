import { useEffect, useReducer } from "react";
import { audioCtx } from "./AudioContext.ctx";
import {
  OscParams,
  AudioContextType,
  ActxStateType,
  NoteObject,
} from "./@types/AudioContext";

let init: boolean, nodeArrInit: boolean;

const initialState: ActxStateType = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  currentNote: 0,
  rhythmResolution: 2,
  currentRoot: "C",
  attack: 0.2,
  release: 0.3,
  nodeArr: [],
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

    case "SETNODEARR": {
      if (action.payload) {
        const newBoxes = action.payload as NoteObject;
        return {
          ...state,
          nodeArr: [...state.nodeArr, newBoxes],
        };
      } else {
        throw new Error("Missing payload");
      }
    }
    default:
      return state;
  }
};

// export const audioCtx: React.Context<AudioContextType | object> = createContext<
//   AudioContextType | object
// >({});

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!nodeArrInit) {
      for (let index = 0; index < 16; index++) {
        dispatch({ type: "SETNODEARR", payload: { id: index, offset: 0 } });
      }
      nodeArrInit = true;
      updateNodeArr();
    }
  }, []);

  const playTone = ({ type, freq, duration, time }: OscParams) => {
    if (state.engine && state.masterVol) {
      const eng: AudioContext = state.engine;
      const osc: OscillatorNode = eng.createOscillator();
      const gain: GainNode = eng.createGain();
      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(1, time + state.attack);
      gain.connect(state.masterVol);
      osc.connect(gain);
      osc.type = type;
      osc.frequency.value = freq;
      osc.start(time);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        time + duration + state.release,
      );
      osc.stop(time + duration + state.release);
    } else {
      throw new Error("Actx state not initialized");
    }
  };

  const toggleMasterPlayPause = () => {
    // first time user presses play we initialize audio engine (autoplay policy)
    if (!init) {
      // create the audio engine and master volume channel and save them.
      const engine = new AudioContext();
      const masterVol = engine.createGain();
      masterVol.connect(engine.destination);

      dispatch({ type: "SETENGINE", payload: engine });
      dispatch({ type: "SETMASTERVOL", payload: masterVol });

      init = true;
    }
    dispatch({ type: "SETCURRENTNOTE", payload: 0 });
    dispatch({ type: "TOGGLEMASTERPLAYING" });
  };

  const spliceSelectedBoxes = (index: number) => {
    const boxes = state.nodeArr;
    boxes.splice(index, 1);
    dispatch({ type: "SETNODEARR", payload: boxes });
  };

  const updateNodeArr = () => {
    console.log("updated");
  };

  const actxVal: AudioContextType = {
    dispatch,
    playTone,
    toggleMasterPlayPause,
    spliceSelectedBoxes,
    updateNodeArr,
    state,
  };

  const actxValIsInit: boolean =
    actxVal !== null &&
    actxVal !== undefined &&
    actxVal.state !== null &&
    actxVal.dispatch !== null &&
    actxVal.playTone !== null &&
    actxVal.updateNodeArr !== null &&
    actxVal.spliceSelectedBoxes !== null &&
    actxVal.toggleMasterPlayPause !== null;

  if (actxValIsInit) {
    return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
  } else {
    throw new Error("Attempted to access actx before initialization");
  }
};
