import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@shared/schema";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-luxury-black via-charcoal to-luxury-black border-amber-600/20">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-amber-600">{product.name}</DialogTitle>
          <DialogDescription className="text-amber-600/70">
            {product.verseReference.replace('Revelation', 'REV').replace('–', '-')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bible Verse */}
          <div className="border-l-4 border-amber-600/40 pl-4">
            <p className="text-amber-600/90 italic">"{product.bibleVerse}"</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-amber-600/80">{product.description}</p>
          </div>

          {/* Concentration & Volume */}
          <div className="flex gap-4">
            <Badge className="bg-champagne text-luxury-black">
              {product.concentration}
            </Badge>
            <Badge className="bg-champagne/80 text-luxury-black">
              {product.volume}
            </Badge>
            <Badge className="bg-amber-600 text-white font-bold">
              ${product.price}
            </Badge>
          </div>

          {/* Fragrance Notes */}
          <div className="space-y-4 bg-luxury-black/50 p-4 rounded-lg border border-amber-600/20">
            <h3 className="text-xl font-serif text-amber-600 mb-4">Fragrance Profile</h3>
            
            <div>
              <h4 className="text-sm font-semibold text-amber-600 mb-1">TOP NOTES</h4>
              <p className="text-amber-600/80 text-sm">{product.topNotes}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-amber-600 mb-1">MIDDLE NOTES</h4>
              <p className="text-amber-600/80 text-sm">{product.middleNotes}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-amber-600 mb-1">BASE NOTES</h4>
              <p className="text-amber-600/80 text-sm">{product.baseNotes}</p>
            </div>
          </div>

          {/* Availability */}
          <div className="text-center">
            <p className="text-amber-600/70 text-sm">
              {product.remainingInventory} of {product.totalInventory} bottles remaining
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
