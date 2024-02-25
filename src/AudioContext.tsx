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
  playTone: ({ type, freq, duration }: OscParams) => void;
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

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  const playTone = (oscParams: OscParams) => {
    const { type, freq, duration } = oscParams;
    const osc = state.engine.createOscillator();
    const oscGain = state.engine.createGain();
    oscGain.connect(state.masterVol);
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(oscGain);
    oscGain.gain.setValueAtTime(1, state.engine.currentTime);
    osc.start();
    oscGain.gain.exponentialRampToValueAtTime(
      0.001,
      state.engine.currentTime + duration / 1000
    );
    setTimeout(() => {
      osc.stop();
      osc.disconnect(oscGain);
      oscGain.disconnect(state.masterVol);
    }, duration);
  };

  const actxVal = {
    dispatch,
    playTone,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
