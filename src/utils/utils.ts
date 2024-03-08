// ========= Logarithmic Range Input Class ========== //

// Generates values on a logarithmic scale from a range input element's position.

export interface LogRangeOptionsTypes {
  minpos: number;
  maxpos: number;
  minval: number;
  maxval: number;
}

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

// ========= Note Getter by Semitone ========== //

// Returns a frequency value based on the frequency parameter adjusted by the semitone parameter.

export const getAdjustedFrequencyBySemitone = (
  semitone: number,
  prevFreq: number
) => {
  const lower = Math.sign(semitone) === -1;
  const higher = Math.sign(semitone) === 1;
  const multiplier = 2 ** (1 / 12);

  if (lower) {
    let lowerFreq = prevFreq;
    for (let index = 0; index < Math.abs(semitone); index++) {
      lowerFreq /= multiplier;
    }
    return lowerFreq;
  } else if (higher) {
    let higherFreq = prevFreq;
    for (let index = 0; index < semitone; index++) {
      higherFreq *= multiplier;
    }
    return higherFreq;
  }
};
