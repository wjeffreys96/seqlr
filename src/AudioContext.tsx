import { useEffect, useReducer, useRef } from "react";
import { audioCtx } from "./AudioContext.ctx";
import {
  OscParams,
  AudioContextType,
  ActxStateType,
  SequencerObject,
} from "./@types/AudioContext";

const initialState: ActxStateType = {
  engine: null,
  masterVol: null,
  globSeqArr: [],
  currentNote: 0,
  rhythmResolution: 2,
  masterPlaying: false,
  scrollLocked: true,
  followEnabled: true,
  currentRoot: "C",
  attack: 0.03,
  release: 0.03,
  tempo: 120,
  sequencerCount: 8,
  nodeCount: 128,
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

    case "SETSCROLLLOCKED":
      if (typeof action.payload === "boolean") {
        return {
          ...state,
          scrollLocked: action.payload,
        };
      } else {
        throw new Error("Incorrect or missing payload");
      }
    case "SETFOLLOWENABLED":
      if (typeof action.payload === "boolean") {
        return {
          ...state,
          followEnabled: action.payload,
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
  const { masterVol, engine, sequencerCount, nodeCount, globSeqArr } = state;
  const globSeqArrInitRef = useRef(false);
  const engineInitRef = useRef(false);
  const globSeqArrLengthRef = useRef(sequencerCount);
  const nodeCountRef = useRef(nodeCount);

  useEffect(() => {
    if (!globSeqArrInitRef.current) {
      // initializing sequencers
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
        nodeCountRef.current = innerArr.length;
      }
      globSeqArrLengthRef.current = outerArr.length;
      dispatch({ type: "SETGLOBSEQARR", payload: outerArr });
      globSeqArrInitRef.current = true;
    } else {
      // updating sequencers
      if (sequencerCount > globSeqArrLengthRef.current) {
        // adding sequencers
        const copiedGlobSeqArr: SequencerObject[] = globSeqArr;
        for (
          let index = 0;
          index < sequencerCount - globSeqArrLengthRef.current;
          index++
        ) {
          let gainNode: GainNode | null;
          if (engine && masterVol) {
            gainNode = engine.createGain();
            gainNode.gain.value = 0.5;
            gainNode.connect(masterVol);
          } else {
            gainNode = null;
          }
          const innerArr = [];
          for (let index = 0; index < nodeCount; index++) {
            innerArr.push({ id: index, offset: 0, isPlaying: false });
          }
          copiedGlobSeqArr.push({
            id: index,
            attack: 0.03,
            release: 0.1,
            gain: gainNode,
            octave: 3,
            waveform: "sine",
            innerArr,
          });
        }
        globSeqArrLengthRef.current = copiedGlobSeqArr.length;
        dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
      } else if (sequencerCount < globSeqArrLengthRef.current) {
        // removing sequencers
        const copiedGlobSeqArr: SequencerObject[] = globSeqArr;
        for (
          let index = 0;
          index < globSeqArrLengthRef.current - sequencerCount;
          index++
        ) {
          copiedGlobSeqArr.pop();
        }
        dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
        globSeqArrLengthRef.current = copiedGlobSeqArr.length;
      } else if (nodeCount > nodeCountRef.current) {
        // adding nodes to all sequencers
        const copiedGlobSeqArr: SequencerObject[] = globSeqArr;
        copiedGlobSeqArr.forEach((thisSequencer) => {
          for (let i = 0; i < nodeCount - nodeCountRef.current; i++) {
            thisSequencer.innerArr.push({
              id: i + nodeCountRef.current,
              offset: 0,
              isPlaying: false,
            });
          }
        });
        dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
        nodeCountRef.current = copiedGlobSeqArr[0].innerArr.length;
      } else if (nodeCount < nodeCountRef.current) {
        // removing nodes from each sequencer
        const copiedGlobSeqArr: SequencerObject[] = globSeqArr;
        copiedGlobSeqArr.forEach((thisSequencer) => {
          for (let i = 0; i < nodeCountRef.current - nodeCount; i++) {
            thisSequencer.innerArr.pop();
          }
        });
        dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
        nodeCountRef.current = copiedGlobSeqArr[0].innerArr.length;
      }
    }
  }, [masterVol, engine, globSeqArr, sequencerCount, nodeCount]);

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

  const changeWaveform = (index: number, waveform: OscillatorType) => {
    const copiedGlobSeqArr = state.globSeqArr;
    const innerArr = copiedGlobSeqArr[index];
    if (innerArr) {
      innerArr.waveform = waveform;
      dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
    } else {
      throw new Error("Could not find sequencer to update waveform");
    }
  };

  const toggleMasterPlayPause = () => {
    // first time user presses play we initialize audio engine (autoplay policy)
    if (!engineInitRef.current) {
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
      engineInitRef.current = true;
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
    changeWaveform,
    state,
  };

  return <audioCtx.Provider value={actxVal}>{children}</audioCtx.Provider>;
};
