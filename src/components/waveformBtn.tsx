import { cn } from "../utils/cn";

interface waveformBtnProps {
  children: React.ReactNode;
  thisOscType: OscillatorType;
  currentSelectedWaveform: OscillatorType;
  setCurrentSelectedWaveform: (thisOscType: OscillatorType) => void;
}

export default function WaveformBtn({
  children,
  thisOscType,
  currentSelectedWaveform,
  setCurrentSelectedWaveform,
}: waveformBtnProps) {
  return (
    <button
      onClick={() => setCurrentSelectedWaveform(thisOscType)}
      className={cn(
        currentSelectedWaveform === thisOscType
          ? "fill-cyan-200 "
          : "fill-neutral-400",
        "rounded-full p-1.5",
      )}
    >
      {children}
    </button>
  );
}
