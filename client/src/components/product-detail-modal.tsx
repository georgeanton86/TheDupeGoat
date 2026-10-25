import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import { chicagoBottleImages, chicagoOffers } from "@shared/chicago";
import HybridInspirations from "@/components/hybrid-inspirations";
import { dreamerOffers, dreamerSizes } from "@shared/dreamer";
import { tdgOffers, tdgSizes, dupeDisclosure, affiliationDisclosure } from "@shared/tdg";

const gamerProducts: Record<string, { image: string; collection: string }> = {
  "PLAYER ONE": { image: chicagoBottleImages["PLAYER ONE"], collection: "THE DUPE GOAT · Gaming Collection" },
  "PLAY AGAIN?": { image: chicagoBottleImages["PLAY AGAIN?"], collection: "THE DUPE GOAT · Gaming Collection" },
  "HALF LIFE": { image: chicagoBottleImages["HALF LIFE"], collection: "THE DUPE GOAT · Gaming Collection" },
};

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;
  const gaming = gamerProducts[product.name.toUpperCase()];
  const gamingOffer = chicagoOffers.find(offer => offer.productId === product.id);
  const dreamer = dreamerOffers.find(offer => offer.productId === product.id);
  const tdg = tdgOffers.find(offer => offer.productId === product.id);
  const notes = [product.topNotes, product.middleNotes, product.baseNotes].some((note) => note?.trim());
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto border-[#d8b76a]/30 bg-[#171a16] p-0 text-[#f3ead8]">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className={`relative flex min-h-[260px] items-center justify-center overflow-hidden ${gaming ? "bg-[#202b36]" : "bg-[#222722] p-8"}`}>
              {gaming || dreamer || tdg ? <img src={gaming?.image || dreamer?.imageUrl || tdg?.imageUrl} alt={gaming ? `Reference photo of ${product.name}; shipped TDG decant differs` : dreamer ? `${product.name} Dreamer Series artwork reference` : `Reference-only ${tdg?.original} bottle by ${tdg?.house}; TDG dupe ships`} className="max-h-[360px] w-full object-contain" /> : (
              <div className="text-center">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-[#d8b76a]">THE DUPE GOAT</span>
                <p className="mt-3 font-serif text-3xl">{product.name}</p>
              </div>
            )}
          </div>
          <div className="p-6 sm:p-9">
            <DialogHeader className="text-left">
               <Badge className="mb-3 w-fit border-0 bg-[#d8b76a]/15 text-[#e5c578]">{gaming ? gaming.collection : dreamer ? `THE DUPE GOAT · Dreamer ${dreamer.number}` : tdg ? `THE DUPE GOAT · dupe ${tdg.code}` : "THE DUPE GOAT"}</Badge>
              <DialogTitle className="font-serif text-3xl text-[#f3ead8]">{product.name}</DialogTitle>
               <DialogDescription className="text-[#f3ead8]/55">{gaming ? "30 mL fragrance decant · $59.99" : dreamer ? `${dreamer.mood} · ${dreamerSizes.join(" / ")} mL` : tdg ? `Inspired by ${tdg.original} / ${tdg.house} · ${tdgSizes.join(" / ")} mL` : "An independent fragrance from THE DUPE GOAT."}</DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-5">
              <p className="text-sm leading-6 text-[#f3ead8]/75">{dreamer?.description || tdg?.description || product.description}</p>
              {gamingOffer && <HybridInspirations inspirations={gamingOffer.inspirations} />}
              {dreamer && <div className="space-y-4 border border-[#72e8ef]/20 bg-[#72e8ef]/5 p-4">
                <div><p className="text-[10px] uppercase tracking-[0.18em] text-[#82e7e5]">Scent profile</p><p className="mt-1 text-sm text-white/80">{dreamer.scentProfile}</p></div>
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#82e7e5]">Notes</p>
                  <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#82e7e5]">TOP</span>{dreamer.topNotes}</p>
                  <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#82e7e5]">HEART</span>{dreamer.middleNotes}</p>
                  <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#82e7e5]">BASE</span>{dreamer.baseNotes}</p>
                </div>
                <p className="text-xs leading-5 text-white/55">A TDG hybrid decant described by its scent notes.</p>
              </div>}
              {tdg && <div className="space-y-3 border border-[#d8b76a]/25 bg-[#d8b76a]/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e5c578]">Scent inspiration only</p>
                <p className="text-sm leading-6 text-white/75">Inspired by {tdg.original} by {tdg.house}. Product name: {tdg.name}.</p>
                <p className="text-xs leading-5 text-white/65">{dupeDisclosure}</p><p className="text-xs leading-5 text-white/55">{affiliationDisclosure}</p>
              </div>}
              {gaming ? (
                <div className="border border-[#d8b76a]/30 bg-[#d8b76a]/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e5c578]">Reference bottle photo</p>
                  <p className="mt-2 text-sm leading-6 text-[#f3ead8]/70">This concept image is for reference. Your Gaming fragrance ships in a separate 30 mL decant bottle.</p>
                   <p className="mt-2 text-xs text-[#f3ead8]/60">Limited run of 25 per fragrance; current availability is shown in the shop. 5, 10, 15, and 20 mL decants are not available. One 30 mL decant of each: $150, automatically discounted in the cart.</p>
                </div>
              ) : (dreamer || tdg) ? (
                <>
                  <div className="flex flex-wrap gap-2"><Badge className="bg-[#d8b76a] text-[#171a16]">{dreamer ? "Hybrid · Extrait de Parfum decant" : "TDG fragrance dupe decant"}</Badge><Badge variant="outline" className="border-[#d8b76a]/40 text-[#f3ead8]/75">{dreamerSizes.join(" / ")} mL</Badge></div>
                  <p className="text-xs text-[#f3ead8]/55">Choose an available size on the shop card. Current price and stock are shown there.</p>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#d8b76a] text-[#171a16]">Eau de Parfum &amp; Extrait</Badge>
                    <Badge variant="outline" className="border-[#d8b76a]/40 text-[#f3ead8]/75">Multiple sizes</Badge>
                  </div>
                  {notes && <div className="space-y-3 border border-[#d8b76a]/20 bg-[#111310]/50 p-4">
                    <h3 className="font-serif text-lg text-[#e5c578]">Fragrance profile</h3>
                    {product.topNotes?.trim() && <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#d8b76a]">TOP</span>{product.topNotes}</p>}
                    {product.middleNotes?.trim() && <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#d8b76a]">HEART</span>{product.middleNotes}</p>}
                    {product.baseNotes?.trim() && <p className="text-sm"><span className="mr-2 text-[10px] font-semibold tracking-widest text-[#d8b76a]">BASE</span>{product.baseNotes}</p>}
                  </div>}
                  <p className="text-xs text-[#f3ead8]/55">Explore sizes and current pricing in the shop.</p>
                </>
              )}
              {tdg && <><span className="absolute left-3 top-3 border border-[#e6bd70]/70 bg-[#11161c]/95 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#f4d99b]">Designer bottle · reference only</span><span className="absolute bottom-3 left-3 bg-[#11161c]/95 px-2.5 py-1.5 text-[10px] text-[#f4d99b]">Inspired by {tdg.original} · {tdg.house}</span></>}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}