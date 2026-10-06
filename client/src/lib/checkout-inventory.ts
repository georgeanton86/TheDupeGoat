import type { ProductVariant } from "@shared/schema";

export async function fetchCheckoutInventory(checkoutKey: string): Promise<ProductVariant[]> {
  const response = await fetch(`/api/checkout-availability/${encodeURIComponent(checkoutKey)}`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Could not check stock. Please try again before paying.");
  return response.json();
}
