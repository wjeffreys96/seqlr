export default function Wrapper({ children }: { children: ReactNode }) {
  return <div className="max-w-7xl mx-auto">{children}</div>;
}
