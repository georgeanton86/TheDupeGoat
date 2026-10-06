import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function ProductShowcase() {
  return (
    <section className="mx-auto grid max-w-7xl overflow-hidden border border-[#72e8ef]/25 bg-[#101820] text-[#f3ead8] md:grid-cols-2">
      <div className="relative min-h-[360px] overflow-hidden">
        <img src="/dreamer/dreamer-series-tdg.jpg" alt="THE DUPE GOAT Dreamer Series artwork, luminous Chicago at night" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111a]/70 via-transparent to-transparent" />
        <Badge className="absolute bottom-5 left-5 rounded-none border border-[#8ef2ed]/40 bg-[#07111a]/85 text-[#b4f7f2]">Dreamer Series · reference artwork</Badge>
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#81e9e3]">THE DUPE GOAT · Chicago, Illinois</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Three states.<br />One collection.</h2>
        <p className="mt-5 text-sm leading-6 text-white/65">Lucid State, Fever Dream, and Altered Mental Status: three hybrid compositions inspired by altered perception. Each size—5, 10, 20, and 30 mL—is priced at $1.50 per mL.</p>
        <p className="mt-4 border-l border-[#e6bd70]/60 pl-4 text-xs leading-5 text-white/55">Designer names and imagery identify fragrance inspirations only. TDG products are independently produced dupes and hybrids, not the original pictured perfumes.</p>
        <Link href="/shop#dreamer" className="mt-8 inline-flex w-fit items-center bg-[#80eee8] px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0b1a20] transition-colors hover:bg-[#b7fff5]">Explore Dreamer</Link>
      </div>
    </section>
  );
}
