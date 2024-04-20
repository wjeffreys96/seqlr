export interface NoteObject {
  id: number;
  offset: number;
  isPlaying: boolean;
}

export interface OscParams {
  type: OscillatorType; // "sine", "square", "sawtooth", "triangle", "custom"
  freq: number; // Hz
  duration: number; // seconds
  time: number; // seconds
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
  globNoteArr: NoteObject[][] | [];
}

export interface AudioContextType {
  dispatch?: React.Dispatch<Action>;
  playTone?: ({ type, freq, duration }: OscParams) => void;
  toggleMasterPlayPause?: () => void;
  spliceSelectedBoxes?: (index: number) => void;
  changeOffset?: (id: number, offset: number) => void;
  toggleNotePlaying?: (id: number, index: number) => void;
  state?: ActxStateType;
}
