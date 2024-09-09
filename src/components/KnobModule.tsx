import { useContext, ReactElement } from "react";
import { audioCtx } from "../AudioContext.ctx";
import { AudioContextType } from "../@types/AudioContext";
import {
  SawWaveIcon,
  SineWaveIcon,
  SquareWaveIcon,
  TriangleWaveIcon,
} from "../assets/icons";
import { cn } from "../utils/cn";

export default function KnobModule({ outerIndex }: { outerIndex: number }) {
  const actx: AudioContextType = useContext(audioCtx);
  const { state, dispatch, changeWaveform, changeOctave } = actx;

  const octaves: number[] = [0, 1, 2, 3, 4, 5, 6, 7];

  if (state && dispatch && changeWaveform && changeOctave) {
    const handleKnobChange = (property: string, value: number) => {
      const copiedGlobSeqArr = state.globSeqArr;
      const thisArr = copiedGlobSeqArr[outerIndex];
      switch (property) {
        case "attack":
          thisArr.attack = value;
          break;

        case "release":
          thisArr.release = value;
          break;

        case "gain":
          if (thisArr.gain && state.engine) {
            thisArr.gain.gain.value = value;
          } else {
            console.error("engine or gain undefined");
          }
          break;

        default:
          console.error("how'd we get here?")
          break;
      }
      dispatch({ type: "SETGLOBSEQARR", payload: copiedGlobSeqArr });
    };

    const knobArr = [
      {
        id: 1,
        name: "Attack",
        min: "0.01",
        max: "1",
        step: "0.005",
        value: state.globSeqArr[outerIndex].attack,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleKnobChange("attack", Number(e.target.value)),
      },
      {
        id: 2,
        name: "Release",
        min: "0.01",
        max: "2",
        step: "0.005",
        value: state.globSeqArr[outerIndex].release,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleKnobChange("release", Number(e.target.value)),
      },
      {
        id: 3,
        name: "Gain",
        min: "0.01",
        max: "1",
        step: "0.01",
        value: state.globSeqArr[outerIndex].gain?.gain.value ?? "0.5",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleKnobChange("gain", Number(e.target.value)),

      },
    ];

    interface waveformBtnType {
      id: number;
      type: OscillatorType;
      icon: ReactElement<SVGElement>;
    }

    const waveFormButtonArr: waveformBtnType[] = [
      {
        id: 1,
        type: "sine",
        icon: SineWaveIcon(),
      },
      {
        id: 2,
        type: "square",
        icon: SquareWaveIcon(),
      },
      {
        id: 3,
        type: "triangle",
        icon: TriangleWaveIcon(),
      },
      {
        id: 4,
        type: "sawtooth",
        icon: SawWaveIcon(),
      },
    ];

    return (
      <div className="flex min-h-8 gap-2 items-center md:justify-center text-sm overflow-x-auto overflow-y-hidden">
        {knobArr.map((slider) => {
          return (
            <div
              key={"kdk" + slider.id}
              className="rounded-lg bg-zinc-900 px-2 border-neutral-600 border shadow-neutral-700 shadow-sm"
            >
              <label
                className="h-8 flex flex-row gap-1 items-center justify-center"
                key={"klk" + slider.id}
              >
                <span className="text-zinc-200">{slider.name}:</span>
                <input
                  value={slider.value}
                  className="h-0.5 w-24"
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  onChange={slider.onChange}
                />
              </label>
            </div>
          );
        })}

        <form
          className="rounded-lg bg-neutral-900 px-2  border-neutral-600 border shadow-neutral-700 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <label className="h-8 flex items-center justify-center gap-2 text-left text-zinc-200 text-sm">
            Oct:
            <div>
              <select
                name="OctaveSelecter"
                defaultValue="3"
                onChange={(e) => {
                  e.preventDefault();
                  changeOctave(outerIndex, Number(e.target.value))
                }}
                className="rounded-full min-w-14 bg-neutral-900 text-cyan-200 text-center text-sm px-0.5 py-[3px]"
              >
                {octaves.map((oct) => {
                  return <option key={"ook" + oct}>{oct}</option>;
                })}
              </select>
            </div>
          </label>
        </form>

        <div className="min-w-48 shadow-neutral-700 shadow-sm rounded-lg bg-neutral-900 border border-neutral-600">
          <div className="flex items-center h-8">
            <span className="ml-2 text-zinc-200">Waveform:</span>
            {waveFormButtonArr.map((btn) => {
              return (
                <button
                  key={`knmk-${btn.id}-${outerIndex}`}
                  onClick={() => changeWaveform(outerIndex, btn.type)}
                  className={cn(
                    state.globSeqArr[outerIndex].waveform === btn.type
                      ? "fill-cyan-200 "
                      : "fill-neutral-400",
                    "rounded-full p-1.5",
                  )}
                >
                  {btn.icon}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    throw new Error("actx not initialized");
  }
}
