export interface NoteObject {
  id: number;
  offset: number;
  isPlaying: boolean;
}

export interface SequencerObject {
  attack: number;
  release: number;
  gain: GainNode | null;
  octave: number;
  waveform: OscillatorType;
  innerArr: NoteObject[];
}

export interface OscParams {
  freq: number; // Hz
  duration: number; // seconds
  time: number; // seconds
  seqOpts: {
    attack: number;
    release: number;
    volume: GainNode;
    waveform: OscillatorType; // "sine", "square", "sawtooth", "triangle", "custom"
  };
}

export interface ActxStateType {
  engine: AudioContext | null;
  masterPlaying: boolean;
  masterVol: GainNode | null;
  rhythmResolution: number;
  currentRoot: string;
  attack: number;
  release: number;
  currentNote: number;
  tempo: number;
  sequencerCount: number;
  nodeCount: number;
  globNoteArr: SequencerObject[] | [];
}

export interface AudioContextType {
  dispatch?: React.Dispatch<Action>;
  playTone?: ({ type, freq, duration }: OscParams) => void;
  toggleMasterPlayPause?: () => void;
  spliceSelectedBoxes?: (index: number) => void;
  changeOffset?: (id: number, offset: number, index: number) => void;
  toggleNotePlaying?: (id: number, index: number) => void;
  state?: ActxStateType;
}
