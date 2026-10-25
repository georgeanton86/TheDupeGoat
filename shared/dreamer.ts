import { decantPrice } from "./decant-pricing";

export const dreamerSizes = [5, 10, 15, 20, 30] as const;

// Fixed IDs keep paid inventory attached to these offers across restarts and publishes.
export const dreamerOffers = [
  {
    number: "01",
    name: "LUCID STATE",
    slug: "lucid-state",
    productId: "64ac0000-0000-4000-8000-000000000001",
    imageUrl: "/dreamer/lucid-state.jpg",
    mood: "Clear. Bright. Elevated.",
    description: "Bright, clean and effortlessly addictive. Lucid State opens with sparkling citrus and neroli before moving into airy florals, aromatic tea and smooth modern woods. Fresh without smelling ordinary—like stepping outside with a completely clear head.",
    scentProfile: "Fresh · Citrus · Neroli · Airy · Clean · Aromatic · Woody",
    topNotes: "Neroli · Bergamot · Citrus Zest",
    middleNotes: "Orange Blossom · Lavender · Tea Accord",
    baseNotes: "Ambroxan · Musk · Cedarwood",
    variantIds: [
      "64ac0000-0000-4000-8000-000000000101",
      "64ac0000-0000-4000-8000-000000000102",
      "64ac0000-0000-4000-8000-000000000105",
      "64ac0000-0000-4000-8000-000000000103",
      "64ac0000-0000-4000-8000-000000000104",
    ],
  },
  {
    number: "02",
    name: "FEVER DREAM",
    slug: "fever-dream",
    productId: "64ac0000-0000-4000-8000-000000000002",
    imageUrl: "/dreamer/fever-dream.jpg",
    mood: "Magnetic. Euphoric. Addictive.",
    description: "Sweet, luminous and slightly surreal. Fever Dream combines an addictive amber-saffron sweetness with bright citrus, clean aromatics and a deeper sensual backbone. It moves between fresh and seductive—the kind of scent that feels familiar for a second, then suddenly becomes something else.",
    scentProfile: "Sweet · Airy · Amber · Citrus · Aromatic · Musky · Seductive",
    topNotes: "Saffron · Citrus Zest · Aldehydic Freshness",
    middleNotes: "Jasmine · Amberwood · Aromatic/Violet Accord",
    baseNotes: "Ambergris Accord · Cedar · Musk",
    variantIds: [
      "64ac0000-0000-4000-8000-000000000201",
      "64ac0000-0000-4000-8000-000000000202",
      "64ac0000-0000-4000-8000-000000000205",
      "64ac0000-0000-4000-8000-000000000203",
      "64ac0000-0000-4000-8000-000000000204",
    ],
  },
  {
    number: "03",
    name: "ALTERED MENTAL STATUS",
    slug: "altered-mental-status",
    productId: "64ac0000-0000-4000-8000-000000000003",
    imageUrl: "/dreamer/altered-mental-status.jpg",
    mood: "Familiar notes. New perspective.",
    description: "The darkest and most complex fragrance in the series. Altered Mental Status begins deceptively fresh with citrus, neroli and crisp green aromatics before shifting into spices, woods, sandalwood and powerful oud. Every component pulls in a different direction, yet together they create something strangely coherent, sophisticated and unmistakable.",
    scentProfile: "Green · Citrus · Woody · Spicy · Oud · Aromatic · Sandalwood",
    topNotes: "Neroli · Bergamot · Green Accord",
    middleNotes: "Iris · Aromatic Spices · Oud Accord",
    baseNotes: "Sandalwood · Cedar · Amber · Musk · Oud",
    variantIds: [
      "64ac0000-0000-4000-8000-000000000301",
      "64ac0000-0000-4000-8000-000000000302",
      "64ac0000-0000-4000-8000-000000000305",
      "64ac0000-0000-4000-8000-000000000303",
      "64ac0000-0000-4000-8000-000000000304",
    ],
  },
] as const;

export const dreamerCollectionDescription =
  "A three-part extrait collection built around altered states of perception—from absolute clarity, to intoxicating dream, to something darker and more complex.";

export const dreamerVariants = dreamerOffers.flatMap(offer => dreamerSizes.map((size, index) => ({
  id: offer.variantIds[index],
  productId: offer.productId,
  sku: `DREAMER-${offer.slug.toUpperCase()}-${size}ML`,
  size: `${size} mL`,
  concentration: "Extrait de Parfum decant",
  price: decantPrice(size),
  totalInventory: 50,
  remainingInventory: 50,
  soldCount: 0,
  isActive: true,
})));

export function isDreamerVariant(variantId: string): boolean {
  return dreamerVariants.some(variant => variant.id === variantId);
}
