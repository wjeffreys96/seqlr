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
  attack: 0.01,
  release: 0.03,
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

    case "SETGLOBNOTEARR": {
      if (Array.isArray(action.payload)) {
        return {
          ...state,
          globNoteArr: action.payload,
        };
      } else {
        throw new Error("Missing Payload");
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

  useEffect(() => {
    if (!globNoteArrInit) {
      const newArr = [];
      for (let index = 0; index < 16; index++) {
        newArr.push({ id: index, offset: 0, isPlaying: false });
      }
      globNoteArrInit = true;
      dispatch({ type: "SETGLOBNOTEARR", payload: newArr });
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

  const toggleNotePlaying = (id: number) => {
    const newArr = state.globNoteArr;
    const foundNote = newArr.find((obj) => {
      return obj.id === id;
    });
    if (foundNote) {
      foundNote.isPlaying = !foundNote.isPlaying;
      dispatch({ type: "SETGLOBNOTEARR", payload: newArr });
    } else {
      throw new Error("note not found");
    }
  };

  const changeOffset = (id: number, offset: number) => {
    const newArr = state.globNoteArr;
    const foundNote = newArr.find((obj) => {
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
