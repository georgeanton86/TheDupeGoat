export const tdgSizes = [5, 10, 20, 30] as const;
export const tdgBrand = "THE DUPE GOAT";
export const dupeDisclosure =
  "TDG fragrances are independently produced dupes, not the original designer perfumes. Designer bottle photos show the scent inspiration only—not the product or packaging you receive. You receive a TDG decant in your selected size.";
export const affiliationDisclosure =
  "THE DUPE GOAT is not affiliated with, endorsed by, or sponsored by the referenced fragrance brands. Brand and fragrance names belong to their respective owners and identify scent inspiration only.";

// Codes are permanent inventory identifiers. Never renumber an existing scent.
const scents = [
  { code: "01", name: "COSMIC CITRUS", slug: "meteore", original: "Météore", house: "Louis Vuitton" },
  { code: "02", name: "OPEN DAYDREAM", slug: "imagination", original: "Imagination", house: "Louis Vuitton" },
  { code: "03", name: "SUN DIP", slug: "afternoon-swim", original: "Afternoon Swim", house: "Louis Vuitton" },
  { code: "04", name: "COASTAL RESET", slug: "pacific-chill", original: "Pacific Chill", house: "Louis Vuitton" },
  { code: "05", name: "BLUE RIVIERA", slug: "neroli-portofino", original: "Neroli Portofino", house: "Tom Ford" },
  { code: "06", name: "DESERT GREEN", slug: "cactus-garden", original: "Cactus Garden", house: "Louis Vuitton" },
  { code: "07", name: "RUBY RESERVE", slug: "rouge-extrait", original: "Baccarat Rouge 540 Extrait", house: "Maison Francis Kurkdjian" },
  { code: "08", name: "RAIN STEEP", slug: "rain-tea", original: "Rain Tea", house: "Chasing Scents" },
  { code: "09", name: "VICTORY LAP", slug: "aventus", original: "Aventus", house: "Creed" },
  { code: "10", name: "DARK INSTINCT", slug: "terrible-teddy", original: "Terrible Teddy", house: "Penhaligon’s" },
  { code: "11", name: "SPICE REBEL", slug: "blazing-sam", original: "The Blazing Mr Sam", house: "Penhaligon’s" },
  { code: "12", name: "GILDED LEGACY", slug: "lord-george", original: "The Tragedy of Lord George", house: "Penhaligon’s" },
  { code: "13", name: "VELVET OUD", slug: "gucci-oud", original: "Gucci Oud", house: "Gucci" },
  { code: "14", name: "SANDAL DRIFT", slug: "santal-33", original: "Santal 33", house: "Le Labo" },
  { code: "15", name: "OUD CROWN", slug: "royal-oud", original: "Royal Oud", house: "Creed" },
  { code: "16", name: "GRAND OUD", slug: "oud-greatness", original: "Oud for Greatness", house: "Initio" },
  { code: "17", name: "WILD FORTUNE", slug: "finley", original: "Fortuitous Finley", house: "Penhaligon’s" },
  { code: "18", name: "LUNAR CHAPTER", slug: "moon-tale", original: "Moon Tale", house: "Louis Vuitton" },
  { code: "19", name: "RUBY HAZE", slug: "rouge", original: "Baccarat Rouge 540", house: "Maison Francis Kurkdjian" },
  { code: "20", name: "GOLDEN TIDE", slug: "millesime", original: "Millésime Impérial", house: "Creed" },
  { code: "21", name: "VETIVER WILD", slug: "wild-vetiver", original: "Wild Vetiver", house: "Creed" },
  { code: "22", name: "DEEP PURPOSE", slug: "purpose-50", original: "Purpose 50", house: "Amouage" },
  { code: "23", name: "GREEN LEGEND", slug: "green-irish", original: "Green Irish Tweed", house: "Creed" },
  { code: "24", name: "NEROLI GLOW", slug: "neroli-36", original: "Neroli 36", house: "Le Labo" },
  { code: "25", name: "SMOKE & EARTH", slug: "patchouli-24", original: "Patchouli 24", house: "Le Labo" },
] as const;

export const tdgOffers = scents.map(scent => ({
  ...scent,
  productId: `70ac0000-0000-4000-8000-${scent.code.padStart(12, "0")}`,
  imageUrl: `/tdg/reference/${scent.slug}.jpg`,
  description: `An independently produced TDG dupe inspired by ${scent.house} ${scent.original}. Explore this scent inspiration in a 5, 10, 20, or 30 mL decant. This is not the original designer fragrance.`,
}));

export const tdgVariants = tdgOffers.flatMap(offer => tdgSizes.map((size, index) => ({
  id: `70ac0000-0000-4000-8000-${String(1000 + Number(offer.code) * 10 + index).padStart(12, "0")}`,
  productId: offer.productId,
  sku: `TDG-${offer.code}-${size}ML`,
  size: `${size} mL`,
  concentration: "Fragrance dupe decant",
  price: (size * 1.5).toFixed(2),
  totalInventory: 50,
  remainingInventory: 50,
  soldCount: 0,
  isActive: true,
})));

export function isTdgVariant(variantId: string): boolean {
  return tdgVariants.some(variant => variant.id === variantId);
}
