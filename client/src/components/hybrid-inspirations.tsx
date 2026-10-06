export default function HybridInspirations({ inspirations, blend, dreamer = false }: {
  inspirations?: readonly string[];
  blend?: string;
  dreamer?: boolean;
}) {
  return (
    <div className={`my-4 border-l-2 pl-4 ${dreamer ? "border-[#72e8ef]/65" : "border-[#dc7895]/65"}`}>
      <p className={`mb-2 font-mono text-[9px] uppercase tracking-[0.17em] ${dreamer ? "text-[#82e7e5]" : "text-[#f1a0b5]"}`}>Hybrid blend · dupe inspirations</p>
      {blend && <p className="text-xs leading-6 text-[#f3ead8]/80">{blend}</p>}
      {inspirations && <ul className="space-y-1 text-xs leading-5 text-[#f3ead8]/80">{inspirations.map(inspiration => <li key={inspiration}>{inspiration}</li>)}</ul>}
      <p className="mt-2 text-[10px] leading-4 text-white/45">Scent inspirations, not original designer ingredients.</p>
    </div>
  );
}
