export interface LogSliderProps {
  ref: LegacyRef<HTMLInputElement>;
  defaultValue?: number;
  minpos?: number;
  maxpos?: number;
  minval?: number;
  maxval?: number;
  labelFor: string;
  unit: string;
  onChange?: (newValues: { position: number; value: number }) => void;
}

export interface LogRangeOptionsTypes {
  minpos: number;
  maxpos: number;
  minval: number;
  maxval: number;
}