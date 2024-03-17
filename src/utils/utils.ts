import { LogRangeOptionsTypes } from "../@types/LogSlider";

// ========= Logarithmic Range Input Class ========== //

// Generates values on a logarithmic scale from a range input element's position.


export class LogRange {
  minpos: number;
  maxpos: number;
  minval: number;
  maxval: number;
  scale: number;

  constructor(options: LogRangeOptionsTypes) {
    this.minpos = options.minpos || 0;
    this.maxpos = options.minpos || 100;
    this.minval = Math.log(options.minval || 1);
    this.maxval = Math.log(options.maxval || 9000);
    this.scale = (this.maxval - this.minval) / (this.maxpos - this.minpos);
  }

  value(position: number) {
    return Math.exp((position - this.minpos) * this.scale + this.minval);
  }

  position(value: number) {
    return this.minpos + (Math.log(value) - this.minval) / this.scale;
  }
}

// ========= Note Frequency Chart ========== //

// Frequency values of notes. Each array item is a different octave.

export const noteFreqs: { [key: string]: Array<number> } = {
  C: [16.35, 32.7, 65.41, 130.81, 261.63, 523.25, 1046.5, 2093.0, 4186.01],
  Db: [17.32, 34.65, 69.3, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
  D: [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
  Eb: [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
  E: [20.6, 41.2, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
  F: [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
  Gb: [23.12, 46.25, 92.5, 185.0, 369.99, 739.99, 1479.98, 2959.96],
  G: [24.5, 49.0, 98.0, 196.0, 392.0, 783.99, 1567.98, 3135.96],
  Ab: [25.96, 51.91, 103.83, 207.65, 415.3, 830.61, 1661.22, 3322.44],
  A: [27.5, 55.0, 110.0, 220.0, 440.0, 880.0, 1760.0, 3520.0],
  Bb: [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
  B: [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07],
};

// ========= Note Getter by Semitone ========== //

// Returns a frequency value based on the prevFreq parameter adjusted by the semitone parameter.

export const getAdjustedFrequencyBySemitone = (
  semitone: number,
  prevFreq: number
) => {
  if (semitone !== 0) {
    const lower = Math.sign(semitone) === -1;
    const higher = Math.sign(semitone) === 1;
    const multiplier = 2 ** (1 / 12);

    if (lower) {
      let lowerFreq = prevFreq;
      for (let i = 0; i < Math.abs(semitone); i++) {
        lowerFreq /= multiplier;
      }
      return lowerFreq;
    } else if (higher) {
      let higherFreq = prevFreq;
      for (let i = 0; i < semitone; i++) {
        higherFreq *= multiplier;
      }
      return higherFreq;
    }
  } else {
    return prevFreq;
  }
};
