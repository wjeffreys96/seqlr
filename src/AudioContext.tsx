import { createContext, useReducer, useEffect } from "react";

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
  state: null,
  dispatch: () => {},
  playTone: () => {},
  toggleMasterPlayPause: () => {},
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "TOGGLEMASTERPLAYING":
      return { ...state, masterPlaying: !state.masterPlaying };

    case "SETENGINE":
      return { ...state, engine: action.payload };

    case "SETMASTERVOL":
      return { ...state, masterVol: action.payload };

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

  useEffect(() => {
    if (!init) {
      console.log("Initializing engine...");
      // create the audio engine and master volume channel and save them to
      const engine = new AudioContext();
      const masterVol = engine.createGain();
      masterVol.connect(engine.destination);

      dispatch({ type: "SETENGINE", payload: engine });
      dispatch({ type: "SETMASTERVOL", payload: masterVol });

      // play silent buffer to unlock audio - otherwise clicking happens when first pressing play
      const silentBuffer = engine.createBuffer(1, 1, 22050);
      const node = engine.createBufferSource();
      node.buffer = silentBuffer;
      node.start(0);

      init = true;
    }
  }, []);

  const playTone = ({ type, freq, duration, time }: OscParams) => {
    const osc = state.engine.createOscillator();
    osc.connect(state.engine.destination);
    osc.type = type;
    osc.frequency.value = freq;
    osc.start(time);
    osc.stop(time + duration);
  };

  const toggleMasterPlayPause = async () => {
    // first time user presses play we check if the engine is suspended (autoplay policy) and resume if necessary
    if (state.engine.state === "suspended") {
      await state.engine.resume();
    }
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
