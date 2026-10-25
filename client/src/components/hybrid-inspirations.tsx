export default function HybridInspirations({ inspirations, notes, dreamer = false }: {
  inspirations?: readonly string[];
  notes?: { top: string; heart: string; base: string };
  dreamer?: boolean;
}) {
  return (
    <div className={`my-4 border-l-2 pl-4 ${dreamer ? "border-[#72e8ef]/65" : "border-[#dc7895]/65"}`}>
      <p className={`mb-2 font-mono text-[9px] uppercase tracking-[0.17em] ${dreamer ? "text-[#82e7e5]" : "text-[#f1a0b5]"}`}>{dreamer ? "Dreamer scent notes" : "Hybrid blend · dupe inspirations"}</p>
      {notes && <div className="space-y-1 text-xs leading-5 text-[#f3ead8]/80">
        <p><span className="text-white/55">Top:</span> {notes.top}</p>
        <p><span className="text-white/55">Heart:</span> {notes.heart}</p>
        <p><span className="text-white/55">Base:</span> {notes.base}</p>
      </div>}
      {inspirations && <ul className="space-y-1 text-xs leading-5 text-[#f3ead8]/80">{inspirations.map(inspiration => <li key={inspiration}>{inspiration}</li>)}</ul>}
      {inspirations && <p className="mt-2 text-[10px] leading-4 text-white/45">Scent inspirations, not original designer ingredients.</p>}
    </div>
  );
}
