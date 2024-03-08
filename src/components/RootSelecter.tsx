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

export default function RootSelecter() {
  const notes = Object.keys(noteFreqs);
  return (
    <form
      className="flex justify-between items-center gap-2 w-full"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label className="flex items-center justify-center gap-2 py-1 text-left text-zinc-300 text-sm">
        Root:
        <div>
          <select
            onChange={(e) => {
              e.preventDefault();
            }}
            className="rounded-full bg-neutral-900 py-1 text-cyan-200 text-center w-14 text-xs"
          >
            {notes.map((note) => {
              return <option key={"nk" + note}>{note}</option>;
            })}
          </select>
        </div>
      </label>
    </form>
  );
}
