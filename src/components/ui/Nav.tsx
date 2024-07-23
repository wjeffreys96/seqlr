import { LogSliderProps } from "../../@types/LogSlider";
import { useRef, useContext } from "react";
import { audioCtx } from "../../AudioContext.ctx.tsx";
import { AudioContextType } from "../../@types/AudioContext";
import { Button } from "./MovingBorder";
import { PlayIcon, StopIcon } from "../../assets/icons";
import LogSlider from "./LogSlider";
import Scheduler from "../Scheduler";
import RootSelecter from "../RootSelecter";
import InputWithLabel from "../InputWithLabel.tsx";

export default function Nav() {
  const masterVolRef = useRef<HTMLInputElement>(null);
  const seqCountRef = useRef<HTMLInputElement>(null);
  const nodeCountRef = useRef<HTMLInputElement>(null);
  const actx = useContext<AudioContextType>(audioCtx);
  const { toggleMasterPlayPause, state, dispatch } = actx;

  if (state && dispatch) {
    const { masterVol, masterPlaying, globSeqArr } = state;

    const handleMasterVolChange = (values: {
      position: number;
      value: number;
    }) => {
      if (masterVol) {
        masterVol.gain.value = values.value / 100;
      }
    };

    const MasterVolSliderOpts: LogSliderProps = {
      ref: masterVolRef,
      onChange: handleMasterVolChange,
      labelFor: "Master Volume:",
      defaultValue: 25,
      minval: 0,
      maxval: 100,
      unit: "",
    };

    return (
      <nav className="flex h-16 bg-zinc-900 shadow-zinc-950 text-black shadow-sm z-40 items-center justify-center">
        <div className="flex gap-[1px] h-12">
          <Button
            isDisplay={masterPlaying}
            borderRadius=".25rem"
            className="border border-neutral-600 bg-neutral-800 h-full"
            onClick={toggleMasterPlayPause}
          >
            {!masterPlaying ? <PlayIcon /> : <StopIcon />}
          </Button>
          <Scheduler globSeqArr={globSeqArr} />
          <RootSelecter />
          <div className="flex justify-between gap-4 border rounded p-2 m-[1px] bg-neutral-800 border-neutral-600">
            <LogSlider options={MasterVolSliderOpts} />
          </div>
          <InputWithLabel
            onSubmit={(e) => {
              e.preventDefault();
              seqCountRef.current?.blur();
              dispatch({
                type: "SETSEQUENCERCOUNT",
                payload: Number(seqCountRef.current?.value),
              });
            }}
            labelText="Sequencers: "
          >
            <input
              onChange={() => {
                dispatch({
                  type: "SETSEQUENCERCOUNT",
                  payload: Number(seqCountRef.current?.value),
                });
              }}
              defaultValue={state.sequencerCount}
              type="number"
              ref={seqCountRef}
              className="rounded-full bg-inherit w-8 text-center"
            />
          </InputWithLabel>
          <InputWithLabel
            onSubmit={(e) => {
              e.preventDefault();
              nodeCountRef.current?.blur();
              dispatch({
                type: "SETNODECOUNT",
                payload: Number(nodeCountRef.current?.value),
              });
            }}
            labelText="Nodes: "
          >
            <input
              onChange={() => {
                dispatch({
                  type: "SETNODECOUNT",
                  payload: Number(nodeCountRef.current?.value),
                });
              }}
              defaultValue={state.nodeCount}
              type="number"
              ref={nodeCountRef}
              className="rounded-full bg-inherit w-8 text-center"
            />
          </InputWithLabel>
        </div>
      </nav>
    );
  } else throw new Error("state is undefined");
}
