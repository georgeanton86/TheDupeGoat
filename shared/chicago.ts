// Stable identifiers keep paid inventory attached to the same offers after a republish.
export const chicagoOffers = [
  {
    name: "PLAYER ONE",
    productId: "54ac0000-0000-4000-8000-000000000001",
    variantId: "54ac0000-0000-4000-8000-000000000011",
    sku: "CHICAGO-PLAYER-ONE-30ML",
    imageUrl: "/assets/generated_images/chicago-player-one-studio.jpg",
  },
  {
    name: "PLAY AGAIN?",
    productId: "54ac0000-0000-4000-8000-000000000002",
    variantId: "54ac0000-0000-4000-8000-000000000012",
    sku: "CHICAGO-PLAY-AGAIN-30ML",
    imageUrl: "/assets/generated_images/chicago-play-again-studio.jpg",
  },
  {
    name: "HALF LIFE",
    productId: "54ac0000-0000-4000-8000-000000000003",
    variantId: "54ac0000-0000-4000-8000-000000000013",
    sku: "CHICAGO-HALF-LIFE-30ML",
    imageUrl: "/assets/generated_images/chicago-half-life-studio.jpg",
  },
] as const;

export const chicagoBottleImages: Record<string, string> = Object.fromEntries(
  chicagoOffers.map(offer => [offer.name, offer.imageUrl]),
);

export const decantDisclosure =
  "Bottle photos are for reference. Your 30 mL fragrance ships in a different decant bottle; its shape and label may vary.";

export const chicagoSetDiscountCents = 3 * 5999 - 15000;

export function countChicagoSets(items: { variantId: string; quantity: number }[]): number {
  return Math.min(...chicagoOffers.map(offer =>
    items.filter(item => item.variantId === offer.variantId).reduce((sum, item) => sum + item.quantity, 0),
  ));
}

export function isChicagoVariant(variantId: string): boolean {
  return chicagoOffers.some(offer => offer.variantId === variantId);
}