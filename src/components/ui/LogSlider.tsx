import { LegacyRef, forwardRef, useState, useRef, memo } from "react";
import { LogSliderProps, LogRangeOptionsTypes } from "../../@types/LogSlider";

class LogRange {
  // Generates values on a logarithmic scale from a range input element's position.
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

const LogSlider = memo(forwardRef(function LogSlider(
  { options }: { options: LogSliderProps },
  ref: LegacyRef<HTMLInputElement>) {
  const {
    defaultValue = options.defaultValue ?? 50,
    minpos = options.minpos ?? 0,
    maxpos = options.maxpos ?? 100,
    minval = options.minval ?? 5,
    maxval = options.maxval ?? 20000,
    onChange,
    labelFor,
    unit,
  } = options;

  const log = new LogRange({
    minpos,
    maxpos,
    minval,
    maxval,
  });

  const [value, setValue] = useState(defaultValue);
  const [numberInputValue, setNumberInputValue] = useState<number>(value);
  const [position, setPosition] = useState(log.position(defaultValue));

  const sliderNumRef = useRef<HTMLInputElement>(null);

  const handleSliderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newPos = Number(e.target.value);
    setPosition(newPos);
    const value = newPos === 0 ? 0 : Math.round(log.value(position));
    setValue(value);
    setNumberInputValue(value);
    if (onChange) {
      onChange(value);
    } else {
      console.error("Pass an onChange prop to LogSlider");
    }
  };

  return (
    <form
      onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValue(Number(numberInputValue));
        setPosition(Number(log.position(numberInputValue)));
        if (onChange) {
          onChange(Number(numberInputValue));
        } else {
          console.error("Pass an onChange or onChange prop to LogSlider");
        }
        sliderNumRef.current!.blur();
      }}
      className="flex justify-center w-full gap-4"
    >
      <label className="text-zinc-200 flex items-center justify-between gap-2 w-full">
        <span>{labelFor}</span>
        <input
          className="h-0.5 my-auto w-24"
          id={labelFor}
          ref={ref}
          type="range"
          min={minpos}
          max={maxpos}
          onChange={handleSliderInput}
          value={position}
          step={maxpos / 1000}
        />
      </label>
      <div className="flex justify-center rounded-full bg-neutral-900 text-cyan-200 text-center px-4 max-w-10 text-sm">
        <input
          className="bg-inherit rounded-full min-w-10 text-center"
          name={labelFor}
          value={numberInputValue}
          onChange={(e) => {
            setNumberInputValue(Number(e.target.value));
          }}
          ref={sliderNumRef}
          type="number"
        />
        {unit && <span className="text-sm text-zinc-400 ml-0.5">{unit}</span>}
      </div>
    </form>
  );
}))

export default LogSlider;
