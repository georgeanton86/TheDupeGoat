export const freeShippingThresholdCents = 5000;
export const standardShippingCents = 899;

// "Over $50" is based on the merchandise subtotal, before promotions.
export function shippingCentsForSubtotal(subtotalCents: number): number {
  return subtotalCents > freeShippingThresholdCents ? 0 : standardShippingCents;
}
