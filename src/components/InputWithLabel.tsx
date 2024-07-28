interface InputWithLabelProps {
  children: React.ReactNode;
  labelText: string;
  onSubmit?: (e: React.SyntheticEvent) => void;
}

export default function InputWithLabel({
  children,
  labelText,
  onSubmit,
}: InputWithLabelProps) {
  return (
    <div className="flex justify-between gap-4 border rounded p-2 m-[1px] bg-neutral-800 border-neutral-600">
      <form
        className="flex justify-between items-center gap-2 w-full"
        onSubmit={onSubmit}
      >
        <label className="flex items-center justify-center gap-2 text-left text-zinc-200 text-sm">
          <span>{labelText}</span>
          <div className="rounded-full bg-neutral-900 text-cyan-200 text-center text-sm px-0.5 py-[3px]">
            {children}
          </div>
        </label>
      </form>
    </div>
  );
}