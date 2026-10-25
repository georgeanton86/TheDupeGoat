import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { chicagoOffers } from "@shared/chicago";
import { dreamerOffers } from "@shared/dreamer";
import { tdgOffers, affiliationDisclosure } from "@shared/tdg";
import { ArrowUpRight } from "lucide-react";
import HybridInspirations from "@/components/hybrid-inspirations";

export function DupeSpotlight() {
  const { data: products } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const featured = tdgOffers.filter(offer => ["02", "07", "09", "14"].includes(offer.code) && products?.some(product => product.id === offer.productId && product.isActive));
  return (
    <div className="border border-[#d4ad70]/35 bg-[#18212a]/90 p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-3">
        {featured.map(offer => <Link key={offer.code} href={`/shop#dupe-${offer.code}`} className="group overflow-hidden border border-[#d4ad70]/20 bg-[#10161a] hover:border-[#d4ad70]/70">
          <div className="relative h-36 sm:h-44">
            <img src={offer.imageUrl} alt={`${offer.original} reference bottle, not shipped packaging`} className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035]" />
            <span className="absolute left-2 top-2 bg-[#10161a]/95 px-2 py-1 font-mono text-[8px] uppercase text-[#d4ad70]">Reference only</span>
          </div>
          <div className="border-t border-[#d4ad70]/15 p-3">
            <p className="text-[10px] leading-4 text-[#d4ad70]">Inspired by {offer.house}</p>
            <p className="mt-1 font-serif text-lg leading-tight">{offer.original}</p>
            <p className="mt-2 text-[9px] uppercase tracking-wider text-[#f3ead8]/60">TDG dupe: {offer.name}</p>
          </div>
        </Link>)}
      </div>
      <p className="mt-3 text-[10px] leading-5 text-[#f3ead8]/70">Independent TDG dupes, not designer perfumes. Choose a 5, 10, 15, 20 or 30 mL decant in the shop; pictured bottles do not ship.</p>
      <Link href="/shop#dupes" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#d4ad70]">Explore all 25 scent inspirations <ArrowUpRight className="h-4 w-4" /></Link>
    </div>
  );
}

export function HybridSpotlight() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {[
        ...dreamerOffers.map(offer => ({ ...offer, collection: "Dreamer", anchor: "dreamer" })),
        ...chicagoOffers.map(offer => ({ ...offer, collection: "Gaming", anchor: "gaming" })),
      ].map(offer => (
        <Link key={offer.productId} href={`/shop#${offer.anchor}`} className={`group overflow-hidden border bg-[#202b36]/95 ${offer.anchor === "dreamer" ? "border-[#72e8ef]/35 hover:border-[#72e8ef]" : "border-[#dc7895]/35 hover:border-[#dc7895]"}`}>
          <div className="relative h-28 sm:h-36">
            <img src={offer.imageUrl} alt={`${offer.name} hybrid reference artwork`} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.035]" />
          </div>
          <div className="border-t border-white/10 px-3 pb-3 pt-2">
            <p className={`font-mono text-[8px] uppercase tracking-[0.14em] ${offer.anchor === "dreamer" ? "text-[#82e7e5]" : "text-[#f1a0b5]"}`}>{offer.collection} hybrid</p>
            <p className="mt-1 min-h-8 text-[11px] font-semibold leading-4 text-[#f3ead8]">{offer.name}</p>
          </div>
        </Link>
      ))}
      <p className="col-span-2 text-[9px] leading-4 text-[#f3ead8]/70 sm:col-span-3">Six TDG hybrid decants. Artwork is reference only; shipped bottles differ.</p>
    </div>
  );
}

export default function ProductGallery() {
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const active = products?.filter(product => product.isActive) ?? [];
  if (isLoading) return <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="h-8 w-56 animate-pulse bg-[#d8b76a]/15" /><div className="mt-8 grid gap-5 md:grid-cols-3">{[0,1,2].map(n => <div key={n} className="h-80 animate-pulse bg-white/5" />)}</div></section>;
  if (isError) return <section className="mx-auto max-w-7xl px-5 py-20 text-center text-[#f3ead8]"><p>Collections could not be loaded just now.</p><Button onClick={() => refetch()} variant="outline" className="mt-4 border-[#d8b76a]/50">Try again</Button></section>;
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 md:py-24">
      <div className="mb-10 border-b border-[#d4ad70]/30 pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4ad70]">Start here · 25 single-scent dupes</p>
        <h2 className="mt-3 font-serif text-4xl leading-[1.04] text-[#f3ead8] sm:text-6xl">Find your inspiration.<br />Make it your everyday.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">Recognizable scent inspirations from Louis Vuitton, Creed, Tom Ford, Le Labo and more. These are independently produced THE DUPE GOAT dupes—not authentic designer perfumes.</p>
        <p className="mt-3 text-xs text-[#d4ad70]">Your choice of 5, 10, 15, 20 or 30 mL · lower price per mL at larger sizes</p>
      </div>

      <div className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tdgOffers.filter(offer => ["01", "02", "05", "07", "09", "14"].includes(offer.code) && active.some(product => product.id === offer.productId)).map(offer => <Link key={offer.code} href={`/shop#dupe-${offer.code}`} className="group overflow-hidden border border-[#e6bd70]/30 bg-[#171e24] hover:border-[#e6bd70]/70">
            <div className="relative h-60 bg-[#10161a]">
              <img src={offer.imageUrl} alt={`Reference-only ${offer.original} by ${offer.house}; TDG dupe decant ships instead`} loading="lazy" className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.035]" />
              <span className="absolute left-3 top-3 bg-[#10161a]/95 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#e6bd70]">Reference bottle · not shipped</span>
            </div>
            <div className="border-t border-[#e6bd70]/20 p-5">
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#e6bd70]">Inspired by {offer.house}</p>
              <h3 className="mt-2 font-serif text-2xl">{offer.original}</h3>
              <p className="mt-3 text-xs text-white/70">TDG dupe: {offer.name}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#e6bd70]">Choose your decant size <ArrowUpRight className="h-4 w-4" /></span>
            </div>
          </Link>)}
        </div>
        <Link href="/shop#dupes" className="mt-7 inline-flex items-center gap-3 bg-[#d4ad70] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-[#151a20] hover:bg-[#e3c28e]">Shop all single-scent dupes <ArrowUpRight className="h-4 w-4" /></Link>
      </div>

      <div className="mb-9 border-t border-[#d4ad70]/25 pt-9"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4ad70]">Another side of the house · owner-created hybrids</p><h2 className="mt-3 font-serif text-3xl sm:text-4xl">Want something unexpected?</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Explore Dreamer and Gaming next. Six house hybrids layer dupe inspirations into their own compositions.</p></div>

      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#82e7e5]">Three states. One collection.</p><h3 className="mt-2 font-serif text-3xl sm:text-4xl">The Dreamer Series</h3></div><Link href="/shop#dreamer" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#82e7e5]">Shop Dreamer <ArrowUpRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {dreamerOffers.map(offer => <article key={offer.productId} className="flex flex-col overflow-hidden border border-[#72e8ef]/25 bg-[#101a24]">
            <Link href="/shop#dreamer" className="group relative block h-72 bg-[#09141d]">
              <img src={offer.imageUrl} alt={`${offer.name} Dreamer hybrid reference artwork`} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" />
              <span className="absolute bottom-3 left-3 bg-[#09141d]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#b5f8f2]">Reference artwork · hybrid {offer.number}</span>
            </Link>
            <div className="flex flex-1 flex-col p-5 sm:p-6"><p className="font-mono text-[9px] uppercase tracking-wider text-[#82e7e5]">{offer.mood}</p><h4 className="mt-2 font-serif text-2xl">{offer.name}</h4><p className="mt-3 text-sm leading-6 text-white/75">{offer.description}</p><HybridInspirations notes={{ top: offer.topNotes, heart: offer.middleNotes, base: offer.baseNotes }} dreamer /><Link href="/shop#dreamer" className="mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-[#82e7e5]">Explore {offer.name} <ArrowUpRight className="h-4 w-4" /></Link></div>
          </article>)}
        </div>
      </div>

      <div className="mb-14">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f1a0b5]">Three Gaming hybrids · 30 mL decants</p><h3 className="mt-2 font-serif text-3xl sm:text-4xl">The Gaming Collection</h3></div><Link href="/shop#gaming" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#f1a0b5]">Shop Gaming <ArrowUpRight className="h-4 w-4" /></Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {chicagoOffers.map(offer => {
            const product = active.find(item => item.id === offer.productId);
            return <article key={offer.productId} className="flex flex-col overflow-hidden border border-[#dc7895]/25 bg-[#25303a]">
              <Link href="/shop#gaming" className="group relative block h-72 bg-[#202b36]">
                <img src={offer.imageUrl} alt={`${offer.name} Gaming hybrid reference artwork`} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.025]" />
                <span className="absolute bottom-3 left-3 bg-[#101820]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#f1a0b5]">Reference artwork · TDG hybrid</span>
              </Link>
              <div className="flex flex-1 flex-col p-5 sm:p-6"><h4 className="font-serif text-2xl">{offer.name}</h4>{product && <p className="mt-3 text-sm leading-6 text-white/75">{product.description}</p>}<HybridInspirations inspirations={offer.inspirations} /><Link href="/shop#gaming" className="mt-auto inline-flex items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-[#f1a0b5]">Explore {offer.name} <ArrowUpRight className="h-4 w-4" /></Link></div>
            </article>;
          })}
        </div>
      </div>

      <p className="mt-8 border-l-2 border-[#e6bd70]/60 pl-4 text-xs leading-5 text-white/70">{affiliationDisclosure}</p>
    </section>
  );
}
