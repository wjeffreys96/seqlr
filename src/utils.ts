// ========= Logarithmic Range Input Slider Class ========== //

// Generates values on a logarithmic scale from a range input elements position. 

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

// ============================================================ //