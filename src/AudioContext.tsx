import { createContext, useReducer, useEffect } from "react";

export interface OscParams {
  type: OscillatorType;
  freq: number;
  duration: number;
}

export interface AudioContextType {
  engine: AudioContext | null;
  masterPlaying: boolean;
  masterVol: GainNode | null;
  state: any;
  dispatch: React.Dispatch<any>;
  playTone: (
    { type, freq, duration }: OscParams,
    engine: AudioContext,
    masterVol: GainNode
  ) => void;
}

let init: boolean;

const initialState = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  state: null,
  dispatch: () => {},
  playTone: () => {},
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

export const EngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!init) {
      // create the audio engine and master volume channel
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

  const playTone = (
    oscParams: OscParams,
    engine: AudioContext,
    masterVol: GainNode
  ) => {
    const { type, freq, duration } = oscParams;
    console.log(oscParams);
    const osc = engine.createOscillator();
    const oscGain = engine.createGain();
    oscGain.connect(masterVol);
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(oscGain);
    oscGain.gain.setValueAtTime(1, engine.currentTime);
    osc.start();
    oscGain.gain.exponentialRampToValueAtTime(
      0.001,
      engine.currentTime + duration / 1000
    );
    setTimeout(() => {
      osc.stop();
      osc.disconnect(oscGain);
      oscGain.disconnect(masterVol);
    }, duration);
  };

  const actxVal = {
    dispatch,
    playTone,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
