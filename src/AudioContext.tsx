import { createContext, useReducer } from "react";
import { OscParams, AudioContextType, NoteObject } from "./@types/AudioContext";

let init: boolean;

const initialState = {
  engine: null,
  masterPlaying: false,
  masterVol: null,
  currentNote: 0,
  rhythmResolution: 2,
  currentRoot: "C",
  selectedBoxes: [],
  dispatch: () => {},
  playTone: () => {},
  toggleMasterPlayPause: () => {},
  spliceSelectedBoxes: () => {},
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

    case "SETRHYTHMRESOLUTION":
      return {
        ...state,
        rhythmResolution: action.payload,
      };

    case "SETCURRENTROOT":
      return {
        ...state,
        currentRoot: action.payload,
      };

    case "SETSELECTEDBOXES":
      const newBoxes: NoteObject[] = action.payload;
      return {
        ...state,
        selectedBoxes: [...state.selectedBoxes, newBoxes],
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

  const spliceSelectedBoxes = (index: number) => {
    const boxes = state.selectedBoxes;
    boxes.splice(index, 1);
    dispatch({ type: "SETSELECTEDBOXES", payload: boxes });
  };

  const actxVal = {
    dispatch,
    playTone,
    toggleMasterPlayPause,
    spliceSelectedBoxes,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
