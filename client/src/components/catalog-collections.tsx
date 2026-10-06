import { useMemo, useState } from "react";
import type { Product, ProductVariant } from "@shared/schema";
import { dreamerOffers, dreamerSizes } from "@shared/dreamer";
import { tdgOffers, tdgSizes, dupeDisclosure, affiliationDisclosure } from "@shared/tdg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Search } from "lucide-react";

type CartAdd = (variant: ProductVariant, product: Product, quantity: number) => void;
type DetailOpen = (product: Product) => void;

const searchText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['’]/g, "").toLowerCase();

export function DreamerCollection({ products, variants, onAdd, onDetails }: {
  products: Product[]; variants: ProductVariant[]; onAdd: CartAdd; onDetails: DetailOpen;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const byId = new Map(products.map(product => [product.id, product]));

  return (
    <section id="dreamer" className="relative mb-20 scroll-mt-24 overflow-hidden border border-[#72e8ef]/30 bg-[#101a24]">
      <div className="absolute inset-0 opacity-25">
        <img src="/dreamer/dreamer-series-tdg.jpg" alt="" className="h-full w-full object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#101820] via-[#101820]/95 to-[#101820]/45" />
      <div className="relative border-b border-[#72e8ef]/20 px-5 py-10 sm:px-8 sm:py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#74e8ed]">THE DUPE GOAT · HYBRID SERIES / 01—03</p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <h2 className="font-serif text-4xl leading-none sm:text-6xl">The Dreamer Series</h2>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[#a4f1ed]">Three states. One collection.</p>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#e5f0ed]/75">A luminous night-city triptych for altered states of perception—from clear-eyed brightness, through the fever of a vivid dream, into a darker and more complex perspective. Each hybrid blends dupe inspirations into its own composition.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#e5f0ed]/70">
          <span>5 / 10 / 20 / 30 mL</span><span>$1.50 per mL</span><span>Live inventory by selected size</span>
        </div>
      </div>
      <div className="relative grid gap-px bg-[#72e8ef]/15 md:grid-cols-3">
        {dreamerOffers.map(offer => {
          const product = byId.get(offer.productId);
          const offerVariants = variants.filter(v => offer.variantIds.some(id => id === v.id));
          const selectedVariant = offerVariants.find(v => v.id === selected[offer.productId]);
          const activeVariant = selectedVariant || offerVariants.find(v => v.isActive && v.remainingInventory > 0) || offerVariants[0];
          const remaining = activeVariant?.remainingInventory ?? 0;
          return (
            <article key={offer.productId} className="group bg-[#111b25]/95">
              <div className="relative h-72 overflow-hidden bg-[#09141d] sm:h-80">
                <img src={offer.imageUrl} alt={`${offer.name} hybrid decant concept`} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]" />
                <span className="absolute left-3 top-3 border border-[#80f0ec]/60 bg-[#09141d]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#a9f6f0]">TDG hybrid · {offer.number}</span>
                <span className="absolute bottom-3 left-3 bg-[#09141d]/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/80">Art is reference · TDG decant ships</span>
              </div>
              <div className="p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#70dfe5]">{offer.mood}</p>
                <h3 className="mt-2 min-h-[2.3em] font-serif text-2xl leading-tight text-[#f1f5ec]">{offer.name}</h3>
                <p className="mt-3 min-h-[5.5rem] text-sm leading-6 text-white/65">{offer.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dreamerSizes.map(size => {
                    const variant = offerVariants.find(v => v.size === `${size} mL`);
                    const available = Boolean(variant?.isActive && variant.remainingInventory > 0);
                    const chosen = activeVariant?.size === `${size} mL`;
                    return <button key={size} type="button" disabled={!available} aria-pressed={chosen}
                      onClick={() => variant && setSelected(current => ({ ...current, [offer.productId]: variant.id }))}
                      className={`min-w-[58px] border px-2 py-2 text-xs transition-colors ${chosen ? "border-[#8df5ed] bg-[#74e8ef]/20 text-white" : available ? "border-white/20 text-white/80 hover:border-[#8df5ed]/70" : "cursor-not-allowed border-white/10 text-white/30 line-through"}`}
                      aria-label={`${size} mL, ${available ? `${variant?.remainingInventory} available` : "sold out"}`}>
                      {size} mL
                    </button>;
                  })}
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                  <div><p className="font-serif text-2xl text-[#9bf0e6]">{activeVariant ? `$${activeVariant.price}` : "—"}</p><p className="mt-1 text-[11px] text-white/50">{activeVariant ? `${activeVariant.size} · ${remaining} in stock` : "Choose an available size"}</p></div>
                  <button type="button" onClick={() => product && onDetails(product)} disabled={!product} className="text-xs uppercase tracking-[0.12em] text-[#a9f6f0] hover:text-white disabled:opacity-40">Scent details <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" /></button>
                </div>
                <Button onClick={() => activeVariant && product && onAdd(activeVariant, product, 1)} disabled={!activeVariant || !product || !activeVariant.isActive || remaining <= 0}
                  className="mt-4 w-full rounded-none bg-[#80eee8] text-[#0b1a20] hover:bg-[#b7fff5]">Add selected size</Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function TdgCollection({ products, variants, onAdd, onDetails }: {
  products: Product[]; variants: ProductVariant[]; onAdd: CartAdd; onDetails: DetailOpen;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const byId = new Map(products.map(product => [product.id, product]));
  const filteredOffers = useMemo(() => tdgOffers.filter(offer =>
    searchText(`${offer.name} ${offer.original} ${offer.house} ${offer.code}`).includes(searchText(query.trim()))
  ), [query]);
  return (
    <section id="dupes" className="mb-20 scroll-mt-24">
      <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#e6bd70]/35 pb-5 sm:flex-row sm:items-end">
        <div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e6bd70]">THE DUPE GOAT · SINGLE-SCENT DUPE COLLECTION</p><h2 className="mt-2 font-serif text-3xl sm:text-5xl">The originals, reimagined.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">25 independently produced scent dupes. Alias names are the product names; designer references identify inspiration only.</p></div>
        <label className="relative block w-full sm:max-w-xs"><span className="sr-only">Search by TDG scent, inspiration, or house</span><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#e6bd70]/70" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search scent or inspiration" className="rounded-none border-[#e6bd70]/30 bg-[#10171c] pl-9 text-white placeholder:text-white/40" /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredOffers.map(offer => {
          const product = byId.get(offer.productId);
          const offerVariants = variants.filter(v => v.productId === offer.productId);
          const selectedVariant = offerVariants.find(v => v.id === selected[offer.productId]);
          const variant = selectedVariant || offerVariants.find(v => v.isActive && v.remainingInventory > 0) || offerVariants[0];
          const image = offer.imageUrl;
          return <article key={offer.productId} className="group overflow-hidden border border-[#e6bd70]/20 bg-[#171e24] transition-colors hover:border-[#e6bd70]/60">
            <div className="relative h-64 overflow-hidden bg-[#10161a] sm:h-72">
              <img src={image} alt={`Reference-only designer bottle of ${offer.original} by ${offer.house}; TDG dupe ships`} loading="lazy" className="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035]" />
              <span className="absolute left-3 top-3 border border-[#f2cd82]/75 bg-[#10161a]/95 px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#f4d99b]">Reference only · not the product</span>
              <span className="absolute bottom-3 left-3 bg-[#10161a]/90 px-2.5 py-1 text-[10px] font-semibold text-[#f4d99b]">Inspired by {offer.original} / {offer.house}</span>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#e6bd70]">TDG DUPE · {offer.code}</p><h3 className="mt-1 font-serif text-2xl">{offer.name}</h3></div><button type="button" onClick={() => product && onDetails(product)} disabled={!product} className="mt-1 text-[10px] uppercase tracking-wider text-[#edca83] hover:text-white disabled:opacity-40">Details</button></div>
              <p className="mt-2 text-xs font-medium leading-5 text-[#f5dba2]">Inspired by {offer.original} · {offer.house}</p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-white/55">{offer.description}</p>
              <p className="mt-3 border-l border-[#e6bd70]/70 pl-3 text-[11px] leading-5 text-white/65">{dupeDisclosure}</p>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {tdgSizes.map(size => {
                  const sizeVariant = offerVariants.find(v => v.size === `${size} mL`);
                  const available = Boolean(sizeVariant?.isActive && sizeVariant.remainingInventory > 0);
                  const active = variant?.id === sizeVariant?.id;
                  return <button key={size} type="button" disabled={!available} aria-pressed={active} onClick={() => sizeVariant && setSelected(current => ({ ...current, [offer.productId]: sizeVariant.id }))}
                    className={`border px-1 py-2 text-[11px] ${active ? "border-[#e6bd70] bg-[#e6bd70]/15 text-white" : available ? "border-white/15 text-white/75 hover:border-[#e6bd70]/60" : "cursor-not-allowed border-white/10 text-white/30 line-through"}`}
                    aria-label={`${size} mL, ${available ? `${sizeVariant?.remainingInventory} in stock` : "sold out"}`}>{size} mL</button>;
                })}
              </div>
              <div className="mt-3 flex items-center justify-between"><span className="font-serif text-xl text-[#f2cd82]">{variant ? `$${variant.price}` : "—"}</span><span className="text-[10px] text-white/50">{variant ? `${variant.remainingInventory} available` : "Unavailable"}</span></div>
              <Button onClick={() => variant && product && onAdd(variant, product, 1)} disabled={!product || !variant || !variant.isActive || variant.remainingInventory <= 0} className="mt-3 w-full rounded-none bg-[#e6bd70] text-[#171a20] hover:bg-[#f5d99e]">Add TDG dupe</Button>
            </div>
          </article>;
        })}
      </div>
      {filteredOffers.length === 0 && <div className="border border-white/15 p-8 text-center text-sm text-white/60">No scents match that search. Try an alias, inspiration, or house name.</div>}
      <p className="mt-6 border border-[#e6bd70]/20 bg-[#e6bd70]/5 p-4 text-xs leading-5 text-white/60">{affiliationDisclosure}</p>
    </section>
  );
}
