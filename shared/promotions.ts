import { shippingCentsForSubtotal } from "./commerce";

// Temporary purchase codes: turn this off after the owner's trial purchase.
// This is a manual switch, not a single-use redemption limit.
export const trialPromotionsEnabled = false;
export const minimumCardChargeCents = 50;

export function parsePromoCodes(value?: string | null): string[] {
  const codes = Array.from(new Set((value ?? "").toUpperCase().trim().split(/[\s,+]+/).filter(Boolean)));
  const allowed = trialPromotionsEnabled ? ["WELCOME10", "FREESHIP", "99OFF"] : ["WELCOME10"];
  if (codes.some(code => !allowed.includes(code))) throw new Error("Promo code is invalid or no longer available.");
  if (codes.includes("WELCOME10") && codes.includes("99OFF")) {
    throw new Error("Use only one percentage discount code. Free shipping can be combined with it.");
  }
  return codes;
}

export function cartPricing(subtotalCents: number, setDiscountCents: number, promoCode?: string | null) {
  const codes = parsePromoCodes(promoCode);
  const discountPercent = codes.includes("99OFF") ? 99 : codes.includes("WELCOME10") ? 10 : 0;
  const merchandiseCents = Math.max(0, subtotalCents - setDiscountCents);
  const discountCents = Math.round(merchandiseCents * discountPercent / 100);
  const shippingCents = codes.includes("FREESHIP") ? 0 : shippingCentsForSubtotal(subtotalCents);
  return {
    codes, discountPercent, discountCents, shippingCents,
    totalCents: merchandiseCents - discountCents + shippingCents,
  };
}
