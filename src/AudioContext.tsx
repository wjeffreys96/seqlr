import { createContext, useReducer } from "react";

export interface OscParams {
  type: OscillatorType; // "sine", "square", "sawtooth", "triangle", "custom"
  freq: number; // Hz
  duration: number; // seconds
  time: number; // seconds
}

export interface AudioContextType {
  engine: AudioContext | null;
  masterPlaying: boolean;
  masterVol: GainNode | null;
  rhythmResolution: number;
  currentRoot: String;
  state: any;
  dispatch: React.Dispatch<any>;
  playTone: ({ type, freq, duration }: OscParams) => void;
  toggleMasterPlayPause: () => void;
}

let init: boolean;

const initialState = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  currentNote: 0,
  rhythmResolution: 4,
  currentRoot: "C",
  dispatch: () => {},
  playTone: () => {},
  toggleMasterPlayPause: () => {},
  state: null,
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "TOGGLEMASTERPLAYING":
      return { ...state, masterPlaying: !state.masterPlaying };

    case "SETENGINE":
      return { ...state, engine: action.payload };

    case "SETMASTERVOL":
      return { ...state, masterVol: action.payload };

    case "SETCURRENTNOTE":
      return {
        ...state,
        currentNote: action.payload < 16 ? action.payload : 0,
      };

    case "SETrhythmResolution":
      return {
        state,
        rhythmResolution: action.payload,
      };

    default:
      return state;
  }
};
export const audioCtx: React.Context<any> =
  createContext<AudioContextType>(initialState);

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const playTone = ({ type, freq, duration, time }: OscParams) => {
    const osc = state.engine.createOscillator();
    osc.connect(state.masterVol);
    osc.type = type;
    osc.frequency.value = freq;
    osc.start(time);
    osc.stop(time + duration);
  };

  const toggleMasterPlayPause = async () => {
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

  const actxVal = {
    dispatch,
    playTone,
    toggleMasterPlayPause,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
