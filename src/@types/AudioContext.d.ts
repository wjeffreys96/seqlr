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

export interface AudioContextType {
  engine: AudioContext | null;
  masterPlaying: boolean;
  masterVol: GainNode | null;
  rhythmResolution: number;
  currentRoot: String;
  currentNote: number;
  selectedBoxes: NoteObject[] | null[];
  dispatch: React.Dispatch<any>;
  playTone: ({ type, freq, duration }: OscParams) => void;
  toggleMasterPlayPause: () => void;
  spliceSelectedBoxes: (index: number) => void;
  state: any;
}