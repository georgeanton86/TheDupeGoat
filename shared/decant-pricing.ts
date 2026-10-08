export const decantPrices = {
  5: "7.50",
  10: "12.00",
  15: "16.50",
  20: "20.00",
  30: "27.00",
} as const;

export type DecantSize = keyof typeof decantPrices;

export function decantPrice(size: number): string {
  const price = decantPrices[size as DecantSize];
  if (!price) throw new Error(`Unsupported decant size: ${size} mL`);
  return price;
}
