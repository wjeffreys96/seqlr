import { LegacyRef, forwardRef, useState } from "react";
import { LogRange } from "../../utils";

export interface LogSliderProps {
  ref: LegacyRef<HTMLInputElement>;
  defaultValue?: number;
  minpos?: number;
  maxpos?: number;
  minval?: number;
  maxval?: number;
  labelFor: string;
  onInput?: (newValues: { position: number; value: number }) => void;
  onChange?: (newValues: { position: number; value: number }) => void;
}

const LogSlider = forwardRef(function LogSlider(
  {
    options,
  }: {
    options: LogSliderProps;
  },
  ref: LegacyRef<HTMLInputElement>
) {
  const {
    defaultValue = options.defaultValue || 50,
    minpos = options.minpos || 0,
    maxpos = options.maxpos || 100,
    minval = options.minval || 5,
    maxval = options.maxval || 20000,
    onInput,
    onChange,
    labelFor,
  } = options;

  const [position, setPosition] = useState(defaultValue);

  const log = new LogRange({
    minpos,
    maxpos,
    minval,
    maxval,
  });

  const calculateValue = (position: number) => {
    if (position === 0) {
      return 0;
    }
    const value = log.value(position);
    if (value > 1000) return Math.round(value / 100) * 100;
    if (value > 500) return Math.round(value / 10) * 10;
    if (value < 10) return value;
    return Math.round(value);
  };
  const [value, setValue] = useState(calculateValue(defaultValue));

  const handleInput = (e: any) => {
    const newPos = e.target.value;
    setPosition(newPos);

    const newValues = {
      position: newPos,
      value: calculateValue(newPos),
    };
    setValue(newValues.value);
    if (onInput) {
      onInput(newValues);
    } else if (onChange) {
      onChange(newValues);
    } else {
      console.error("Pass an onChange or onInput prop to LogSlider");
    }
  };

  return (
    <div className="flex justify-evenly w-48">
      <div className="text-center">({Math.floor(value)})</div>
      <input
        id={labelFor}
        ref={ref}
        type="range"
        min={minpos}
        max={maxpos}
        onInput={handleInput}
        value={position}
        step={maxpos / 1000}
      />
    </div>
  );
});

export default LogSlider;
