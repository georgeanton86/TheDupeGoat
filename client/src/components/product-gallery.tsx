import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { chicagoBottleImages } from "@shared/chicago";
import { dreamerOffers } from "@shared/dreamer";
import { tdgOffers, affiliationDisclosure } from "@shared/tdg";
import { ArrowUpRight } from "lucide-react";

export default function ProductGallery() {
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const active = products?.filter(product => product.isActive) ?? [];
  const gamers = active.filter(product => Boolean(chicagoBottleImages[product.name.toUpperCase()]));
  if (isLoading) return <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="h-8 w-56 animate-pulse bg-[#d8b76a]/15" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map(n => <div key={n} className="h-80 animate-pulse bg-white/5" />)}</div></section>;
  if (isError) return <section className="mx-auto max-w-7xl px-5 py-20 text-center text-[#f3ead8]"><p>Collections could not be loaded just now.</p><Button onClick={() => refetch()} variant="outline" className="mt-4 border-[#d8b76a]/50">Try again</Button></section>;
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-28">
      <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#d4ad70]/30 pb-8 md:flex-row md:items-end">
        <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4ad70]">THE DUPE GOAT · Chicago after hours</p><h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.04] text-[#f3ead8] sm:text-6xl">Three ways to<br />change the scene.</h2></div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d4ad70] hover:text-[#f3ead8]">Explore every scent <ArrowUpRight className="h-4 w-4" /></Link>
      </div>

      <Link href="/shop#dreamer" className="group mb-8 grid overflow-hidden border border-[#6ce0df]/35 bg-[#101a24] md:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[280px] overflow-hidden bg-[#0a141d] sm:min-h-[390px]">
          <img src="/dreamer/dreamer-series-tdg.jpg" alt="The Dreamer Series luminous Chicago night-city bottle artwork" className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07121b]/70 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#d5ffff]">TDG hybrid series · artwork reference</span>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#7ce9e6]">Three states. One collection.</p>
          <h3 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">The Dreamer Series</h3>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/65">Lucid State. Fever Dream. Altered Mental Status. A triptych of altered perception, with four size options from 5 to 30 mL.</p>
          <div className="mt-6 flex flex-wrap gap-2">{dreamerOffers.map(offer => <Badge key={offer.number} className="rounded-none border border-[#73e6e2]/30 bg-[#73e6e2]/10 text-[#b5f8f2]">{offer.name}</Badge>)}</div>
          <span className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8ff1e9]">Discover the series <ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </Link>

      <div className="mb-8 grid gap-6 md:grid-cols-[1fr_1fr]">
        <article className="border border-[#e6bd70]/25 bg-[#171e24] p-6 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e6bd70]">25 single-scent dupes</p><h3 className="mt-3 font-serif text-3xl">The TDG library</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">Alias names, familiar scent directions. Each designer bottle image is explicitly a reference for inspiration only; TDG is independently produced and unaffiliated.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {tdgOffers.slice(0, 3).map(offer => <Link key={offer.code} href="/shop#dupes" className="group/card relative overflow-hidden border border-[#e6bd70]/15 bg-[#10161a]">
              <span className="absolute left-1 top-1 z-10 bg-[#10161a]/95 px-1.5 py-1 font-mono text-[7px] uppercase tracking-wider text-[#f4d99b]">Reference only</span>
              <img src={offer.imageUrl} alt={`Reference-only ${offer.original} bottle`} className="h-32 w-full object-contain p-2 transition-transform group-hover/card:scale-105" />
              <span className="block border-t border-white/10 px-2 py-2 text-[8px] leading-4 text-[#f4d99b]">Inspired by {offer.original}<br />{offer.house}</span>
            </Link>)}
          </div>
          <Link href="/shop#dupes" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#e6bd70]">Search all 25 <ArrowUpRight className="h-4 w-4" /></Link>
        </article>
        <article className="relative overflow-hidden border border-[#dc7895]/25 bg-[#171e24] p-6 sm:p-8">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[url('/chicago/chicago-noir-skyline.jpg')] bg-cover bg-center opacity-15" />
          <div className="relative"><p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ee88a4]">Chicago originals · 01—03</p><h3 className="mt-3 font-serif text-3xl">The Gaming Collection</h3>
            <p className="mt-3 text-sm leading-6 text-white/60">Arcade spirit meets night-city perfumery. Each original is offered as a 30 mL decant for $59.99; the Gaming three-piece set is $150.</p>
            {gamers.length > 0 && <div className="mt-5 flex gap-3">{gamers.map(product => <img key={product.id} src={chicagoBottleImages[product.name.toUpperCase()]} alt={`Gaming scent reference art: ${product.name}`} className="h-32 min-w-0 flex-1 object-contain" />)}</div>}
            <Link href="/shop#gaming" className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#f1a0b5]">Explore Gaming <ArrowUpRight className="h-4 w-4" /></Link>
          </div>
        </article>
      </div>
      <p className="border-l-2 border-[#e6bd70]/60 pl-4 text-xs leading-5 text-white/50">{affiliationDisclosure}</p>
      {active.length === 0 && <div className="mt-8 border border-[#d8b76a]/20 px-6 py-12 text-center text-[#f3ead8]/70">Our collections are being refreshed. Please check back soon.</div>}
    </section>
  );
}
