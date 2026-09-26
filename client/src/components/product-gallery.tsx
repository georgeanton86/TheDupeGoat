import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { ArrowUpRight } from "lucide-react";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

const chicagoBottle: Record<string, string> = {
  "PLAYER ONE": "/chicago/player-one.jpg",
  "PLAY AGAIN?": "/chicago/play-again.jpg",
  "HALF LIFE": "/chicago/half-life.jpg",
};
const rvltnBottle: Record<string, string> = {
  "EQUUS ALBUS": equusAlbusImage, "PAX OBSCURA": paxObscuraImage, FAMES: famesImage,
  MORTEM: mortemImage, "VOX CAELI": voxCaeliImage, "TERRA TREMOR": terraTremorImage,
  SABBATUM: sabbatumImage, "LUX AETERNA": luxAeternaImage,
};

export default function ProductGallery() {
  const { data: products, isLoading, isError, refetch } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const active = products?.filter((product) => product.isActive) ?? [];
  const gamers = active.filter((product) => Boolean(chicagoBottle[product.name.toUpperCase()]));
  const seals = active.filter((product) => !chicagoBottle[product.name.toUpperCase()]);

  if (isLoading) return <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8" aria-label="Loading collections"><div className="h-8 w-56 animate-pulse bg-[#d8b76a]/15" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0,1,2].map((n) => <div key={n} className="h-80 animate-pulse bg-white/5" />)}</div></section>;
  if (isError) return <section className="mx-auto max-w-7xl px-5 py-20 text-center text-[#f3ead8]"><p>Collections could not be loaded just now.</p><Button onClick={() => refetch()} variant="outline" className="mt-4 border-[#d8b76a]/50">Try again</Button></section>;

  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="mb-12 flex flex-col justify-between gap-5 border-b border-[#d8b76a]/25 pb-8 md:flex-row md:items-end">
        <div><p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d8b76a]">Two worlds, one house</p><h2 className="mt-3 font-serif text-4xl text-[#f3ead8] sm:text-5xl">Find your own atmosphere.</h2></div>
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-[#d8b76a] hover:text-[#f3ead8]">Explore every scent <ArrowUpRight className="h-4 w-4" /></Link>
      </div>

      {gamers.length > 0 && <div className="mb-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b76a]">Chicago Exclusif Parfums</p><h3 className="mt-2 font-serif text-3xl text-[#f3ead8]">The Gaming Collection</h3></div>
          <Badge className="border border-[#cf3e68]/50 bg-[#cf3e68]/10 text-[#ff8ba8]">Bottle previews · not for sale</Badge>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {gamers.map((product, index) => <article key={product.id} className="group overflow-hidden border border-white/10 bg-[#171a16] transition-transform duration-500 hover:-translate-y-1" style={{ animationDelay: `${index * 90}ms` }}>
            <div className="relative flex h-[310px] items-center justify-center overflow-hidden bg-[#232722] p-5">
              <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(61,113,121,.4), transparent 65%)" }} />
              <img src={chicagoBottle[product.name.toUpperCase()]} alt={`${product.name} real bottle photo`} loading="lazy" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute left-4 top-4 border border-[#cf3e68]/55 bg-[#171a16]/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ff91ad]">Preview only</span>
            </div>
            <div className="p-5"><h4 className="font-serif text-2xl text-[#f3ead8]">{product.name}</h4><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#f3ead8]/60">{product.description}</p>
              <Link href="/shop" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#d8b76a]">See collection details <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </article>)}
        </div>
      </div>}

      {seals.length > 0 && <div>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[10px] uppercase tracking-[0.25em] text-[#d8b76a]">An independent collection</p><h3 className="mt-2 font-serif text-3xl text-[#f3ead8]">RVLTN · The Seven Seals</h3></div>
          <p className="max-w-md text-sm leading-6 text-[#f3ead8]/55">A spiritual fragrance collection inspired by Revelation. Shop available sizes and concentrations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seals.map((product) => <article key={product.id} className="group border border-[#d8b76a]/15 bg-[#171a16] p-4 transition-colors hover:border-[#d8b76a]/50">
            <div className="flex h-56 items-center justify-center bg-[#20231f] p-4"><img src={rvltnBottle[product.name.toUpperCase()] || product.imageUrl} alt={`${product.name} RVLTN bottle`} loading="lazy" className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" /></div>
            <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-[#d8b76a]">Seven Seals collection</p><h4 className="mt-1 font-serif text-xl text-[#f3ead8]">{product.name}</h4>
          </article>)}
        </div>
      </div>}
      {active.length === 0 && <div className="border border-[#d8b76a]/20 px-6 py-12 text-center text-[#f3ead8]/70">Our collections are being refreshed. Please check back soon.</div>}
    </section>
  );
}