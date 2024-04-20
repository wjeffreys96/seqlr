export default function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto">{children}</div>;
}
