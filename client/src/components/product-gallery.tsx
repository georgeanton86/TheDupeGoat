import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { chicagoBottleImages, decantDisclosure } from "@shared/chicago";
import { ArrowUpRight } from "lucide-react";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

const rvltnBottle: Record<string, string> = {
  "EQUUS ALBUS": equusAlbusImage, "PAX OBSCURA": paxObscuraImage, FAMES: famesImage,
  MORTEM: mortemImage, "VOX CAELI": voxCaeliImage, "TERRA TREMOR": terraTremorImage,
  SABBATUM: sabbatumImage, "LUX AETERNA": luxAeternaImage,
};

export default function ProductGallery() {
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const active = products?.filter((product) => product.isActive) ?? [];
  const gamers = active.filter((product) => Boolean(chicagoBottleImages[product.name.toUpperCase()]));
  const seals = active.filter((product) => !chicagoBottleImages[product.name.toUpperCase()]);

  if (isLoading) return <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-label="Loading collections"><div className="h-8 w-56 animate-pulse bg-[#d8b76a]/15" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map((n) => <div key={n} className="h-80 animate-pulse bg-white/5" />)}</div></section>;
  if (isError) return <section className="mx-auto max-w-7xl px-5 py-20 text-center text-[#f3ead8]"><p>Collections could not be loaded just now.</p><Button onClick={() => refetch()} variant="outline" className="mt-4 border-[#d8b76a]/50">Try again</Button></section>;

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 md:py-28">
      <div className="mb-14 flex flex-col justify-between gap-5 border-b border-[#d4ad70]/30 pb-8 md:flex-row md:items-end">
        <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4ad70]">Chicago after hours · two distinct collections</p><h2 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.04] text-[#f3ead8] sm:text-6xl">Scent has a city<br className="hidden sm:block"/> on its side.</h2></div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d4ad70] hover:text-[#f3ead8]">Explore every scent <ArrowUpRight className="h-4 w-4" /></Link>
      </div>

      {gamers.length > 0 && <div className="mb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
           <div><p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#dc7895]">Chicago Exclusif originals · 01—03</p><h3 className="mt-2 font-serif text-3xl text-[#f3ead8] sm:text-4xl">The Gaming Collection</h3></div>
            <Badge className="rounded-none border border-[#dc7895]/40 bg-[#dc7895]/10 text-[#f1a0b5]">30 mL decants · $59.99 each</Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {gamers.map((product, index) => <article key={product.id} className="group overflow-hidden border border-white/10 bg-[#181f26] transition-all duration-500 hover:-translate-y-1 hover:border-[#dc7895]/55" style={{ animationDelay: `${index * 90}ms` }}>
             <div className="noir-grain relative flex h-[310px] items-center justify-center overflow-hidden bg-[#1b2732] p-5">
              <img src={chicagoBottleImages[product.name.toUpperCase()]} alt={`Reference photo of ${product.name}; shipped decant bottle differs`} loading="lazy" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.035]" />
              <span className="absolute left-4 top-4 border border-[#dc7895]/55 bg-[#171a20]/90 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#f1a0b5]">Reference photo · decant ships</span>
            </div>
             <div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#dc7895]">Chicago original · 0{index + 1}</p><h4 className="mt-2 font-serif text-2xl text-[#f3ead8]">{product.name}</h4><p className="mt-2 text-sm leading-6 text-[#f3ead8]/70">{decantDisclosure}</p>
               <Link href="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d4ad70]">Shop 30 mL decants <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </article>)}
        </div>
      </div>}

      {seals.length > 0 && <div>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-t border-[#d4ad70]/25 pt-10">
           <div><p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d4ad70]">A distinct collection · RVLTN Parfums</p><h3 className="mt-2 font-serif text-3xl text-[#f3ead8] sm:text-4xl">The Seven Seals</h3></div>
           <p className="max-w-md text-sm leading-6 text-[#f3ead8]/55">Eight spiritual fragrances inspired by Revelation. Discover purchasable offerings in available sizes and concentrations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seals.map((product, index) => <article key={product.id} className="group border border-[#d4ad70]/15 bg-[#1b2228] p-3 transition-colors hover:border-[#d4ad70]/50">
            <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#242b30] p-4"><span className="absolute left-3 top-3 font-mono text-[9px] text-[#d4ad70]/70">SEAL 0{index + 1}</span><img src={rvltnBottle[product.name.toUpperCase()] || product.imageUrl} alt={`${product.name} RVLTN bottle`} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" /></div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4ad70]">Seven Seals · RVLTN</p><h4 className="mt-1 font-serif text-xl text-[#f3ead8]">{product.name}</h4>
          </article>)}
        </div>
      </div>}
      {active.length === 0 && <div className="border border-[#d8b76a]/20 px-6 py-12 text-center text-[#f3ead8]/70">Our collections are being refreshed. Please check back soon.</div>}
    </section>
  );
}