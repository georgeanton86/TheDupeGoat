import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";
import equusAlbusImage from "@assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png";
import paxObscuraImage from "@assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png";
import famesImage from "@assets/generated_images/Fames_luxury_bottle_fd04fa9c.png";
import mortemImage from "@assets/generated_images/Mortem_luxury_bottle_f077a9fa.png";
import voxCaeliImage from "@assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png";
import terraTremorImage from "@assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png";
import sabbatumImage from "@assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png";
import luxAeternaImage from "@assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png";

const gamerProducts: Record<string, { image: string; collection: string }> = {
  "PLAYER ONE": { image: "/chicago/player-one.jpg", collection: "Chicago Exclusif · Gaming Collection" },
  "PLAY AGAIN?": { image: "/chicago/play-again.jpg", collection: "Chicago Exclusif · Gaming Collection" },
  "HALF LIFE": { image: "/chicago/half-life.jpg", collection: "Chicago Exclusif · Gaming Collection" },
};
const sealsImages: Record<string, string> = {
  "EQUUS ALBUS": equusAlbusImage, "PAX OBSCURA": paxObscuraImage, FAMES: famesImage,
  MORTEM: mortemImage, "VOX CAELI": voxCaeliImage, "TERRA TREMOR": terraTremorImage,
  SABBATUM: sabbatumImage, "LUX AETERNA": luxAeternaImage,
};

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;
  const gaming = gamerProducts[product.name.toUpperCase()];
  const sealsImage = sealsImages[product.name.toUpperCase()];
  const verseReference = product.verseReference?.trim();
  const hasVerse = !gaming && Boolean(product.bibleVerse?.trim());
  const notes = [product.topNotes, product.middleNotes, product.baseNotes].some((note) => note?.trim());
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto border-[#d8b76a]/30 bg-[#171a16] p-0 text-[#f3ead8]">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#222722] p-8">
            {gaming || sealsImage ? <img src={gaming?.image || sealsImage} alt={`${product.name} fragrance bottle`} className="max-h-[360px] w-full object-contain" /> : (
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#d8b76a]">RVLTN Parfums</span>
                <p className="mt-3 font-serif text-3xl">{product.name}</p>
              </div>
            )}
          </div>
          <div className="p-6 sm:p-9">
            <DialogHeader className="text-left">
              <Badge className="mb-3 w-fit border-0 bg-[#d8b76a]/15 text-[#e5c578]">{gaming ? gaming.collection : "RVLTN · The Seven Seals Collection"}</Badge>
              <DialogTitle className="font-serif text-3xl text-[#f3ead8]">{product.name}</DialogTitle>
              <DialogDescription className="text-[#f3ead8]/55">{gaming ? "A bottle preview from the Chicago Exclusif gaming collection." : (verseReference || "A fragrance in the Seven Seals collection.")}</DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-5">
              {hasVerse && <blockquote className="border-l-2 border-[#d8b76a] pl-4 text-sm italic leading-6 text-[#f3ead8]/75">“{product.bibleVerse}”<span className="mt-2 block not-italic text-xs text-[#d8b76a]">{verseReference}</span></blockquote>}
              <p className="text-sm leading-6 text-[#f3ead8]/75">{product.description}</p>
              {gaming ? (
                <div className="border border-[#d8b76a]/30 bg-[#d8b76a]/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e5c578]">Collection preview</p>
                  <p className="mt-2 text-sm leading-6 text-[#f3ead8]/70">This bottle is shown as a preview only. It is not currently offered for sale.</p>
                </div>
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}