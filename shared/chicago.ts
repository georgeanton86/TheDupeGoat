import { isDreamerVariant } from "./dreamer";
import { isTdgVariant } from "./tdg";

// Stable identifiers keep paid inventory attached to the same offers after a republish.
export const chicagoOffers = [
  {
    name: "PLAYER ONE",
    productId: "54ac0000-0000-4000-8000-000000000001",
    variantId: "54ac0000-0000-4000-8000-000000000011",
    sku: "CHICAGO-PLAYER-ONE-30ML",
    imageUrl: "/gaming/player-one-cinematic.jpg",
  },
  {
    name: "PLAY AGAIN?",
    productId: "54ac0000-0000-4000-8000-000000000002",
    variantId: "54ac0000-0000-4000-8000-000000000012",
    sku: "CHICAGO-PLAY-AGAIN-30ML",
    imageUrl: "/gaming/play-again-cinematic.jpg",
  },
  {
    name: "HALF LIFE",
    productId: "54ac0000-0000-4000-8000-000000000003",
    variantId: "54ac0000-0000-4000-8000-000000000013",
    sku: "CHICAGO-HALF-LIFE-30ML",
    imageUrl: "/gaming/half-life-cinematic.jpg",
  },
] as const;

export const chicagoBottleImages: Record<string, string> = Object.fromEntries(
  chicagoOffers.map(offer => [offer.name, offer.imageUrl]),
);

export const decantDisclosure =
  "Bottle images show scent inspiration only. You receive a TDG dupe or hybrid decant in your selected size—not an original designer perfume or its pictured packaging.";

export const chicagoSetDiscountCents = 3 * 5999 - 15000;

export function countChicagoSets(items: { variantId: string; quantity: number }[]): number {
  return Math.min(...chicagoOffers.map(offer =>
    items.filter(item => item.variantId === offer.variantId).reduce((sum, item) => sum + item.quantity, 0),
  ));
}

export function isChicagoVariant(variantId: string): boolean {
  return chicagoOffers.some(offer => offer.variantId === variantId) || isDreamerVariant(variantId) || isTdgVariant(variantId);
}