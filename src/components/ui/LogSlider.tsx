import { LegacyRef, forwardRef, useState, useRef } from "react";
import { LogRange } from "../../utils";

export interface LogSliderProps {
  ref: LegacyRef<HTMLInputElement>;
  defaultValue?: number;
  minpos?: number;
  maxpos?: number;
  minval?: number;
  maxval?: number;
  labelFor: string;
  unit: string;
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
  const sliderNumRef = useRef<HTMLInputElement>(null);
  const {
    defaultValue = options.defaultValue || 50,
    minpos = options.minpos || 0,
    maxpos = options.maxpos || 100,
    minval = options.minval || 5,
    maxval = options.maxval || 20000,
    onInput,
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

  const [position, setPosition] = useState(log.position(defaultValue));

  const calculateValue = (position: number) => {
    if (position == 0) {
      return 0;
    }
    const value = log.value(position);
    if (value > 1000) return Math.round(value / 100) * 100;
    if (value > 500) return Math.round(value / 10) * 10;
    return Math.round(value);
  };

  const [value, setValue] = useState(defaultValue);
  const [sliderNumVal, setSliderNumVal] = useState<number>(value);

  const handleInput = (e: any) => {
    const newPos = e.target.value;
    setPosition(newPos);

    const newValues = {
      position: newPos,
      value: calculateValue(newPos),
    };

    setValue(newValues.value);
    setSliderNumVal(newValues.value);
    if (onInput) {
      onInput(newValues);
    } else if (onChange) {
      onChange(newValues);
    } else {
      console.error("Pass an onChange or onInput prop to LogSlider");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setValue(Number(sliderNumVal));
        setPosition(Number(log.position(sliderNumVal)));
        const newValues = {
          position: Number(log.position(sliderNumVal)),
          value: sliderNumVal,
        };
        if (onInput) {
          onInput(newValues);
        } else if (onChange) {
          onChange(newValues);
        } else {
          console.error("Pass an onChange or onInput prop to LogSlider");
        }
        sliderNumRef.current!.blur();
      }}
      className="flex justify-center min-w-56 gap-4"
    >
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
      <div className="flex justify-center rounded-full bg-neutral-900 py-1 text-cyan-200 text-center px-4 w-24 text-sm">
        <input
          className="bg-inherit max-w-10 text-center"
          value={sliderNumVal}
          onChange={(e) => {
            setSliderNumVal(Number(e.target.value));
          }}
          ref={sliderNumRef}
          type="number"
        />
        {unit && <span className="text-sm text-zinc-400 ml-0.5">{unit}</span>}
      </div>
    </form>
  );
});

export default LogSlider;
