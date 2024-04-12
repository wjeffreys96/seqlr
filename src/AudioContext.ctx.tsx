import { createContext } from "react";
import { AudioContextType } from "./@types/AudioContext";

export const audioCtx: React.Context<AudioContextType | object> = createContext<
  AudioContextType | object
>({});
