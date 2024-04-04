export interface NoteObject {
  id: number;
  offset: number;
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
  currentNote: number;
  selectedBoxes: NoteObject[] | null[];
}

export interface AudioContextType {
  dispatch: React.Dispatch<unknown>;
  playTone: ({ type, freq, duration }: OscParams) => void;
  toggleMasterPlayPause: () => void;
  spliceSelectedBoxes: (index: number) => void;
  state: ActxStateType;
}
