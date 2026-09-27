import { Pool } from "pg";
import type Stripe from "stripe";
import { storage } from "./storage";
import { chicagoSetDiscountCents, countChicagoSets, isChicagoVariant } from "@shared/chicago";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for orders");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export type CartLine = { variantId: string; quantity: number };

export async function getPaidQuantities(): Promise<Map<string, number>> {
  const result = await pool.query(
    `SELECT line->>'variantId' AS variant_id,
            SUM((line->>'quantity')::integer)::integer AS sold
     FROM payment_orders, LATERAL jsonb_array_elements(items) AS line
     GROUP BY line->>'variantId'`,
  );
  return new Map(result.rows.map(row => [row.variant_id, row.sold]));
}

export async function priceCart(items: CartLine[], promoCode?: string) {
  let subtotalCents = 0;
  const paid = await getPaidQuantities();
  for (const item of items) {
    const variant = await storage.getProductVariant(item.variantId);
    if (!variant || !variant.isActive) throw new Error("An item is no longer available");
    if (variant.remainingInventory - (paid.get(item.variantId) ?? 0) < item.quantity)
      throw new Error("Insufficient inventory");
    subtotalCents += Math.round(Number(variant.price) * 100) * item.quantity;
  }
  const setDiscountCents = countChicagoSets(items) * chicagoSetDiscountCents;
  const discountCents = promoCode?.toUpperCase() === "WELCOME10"
    ? Math.round((subtotalCents - setDiscountCents) * 0.1) : 0;
  const shippingCents = subtotalCents >= 10000 ? 0 : 899;
  return subtotalCents - setDiscountCents - discountCents + shippingCents;
}

export async function recordPaidOrder(intent: Stripe.PaymentIntent) {
  if (intent.status !== "succeeded" || intent.currency !== "usd" ||
      intent.amount_received !== intent.amount || intent.amount <= 0) {
    throw new Error("Payment has not been captured in full");
  }
  const items = JSON.parse(intent.metadata.items || "null") as CartLine[] | null;
  const email = intent.receipt_email;
  const shipping = intent.shipping;
  if (!items || !Array.isArray(items) || !items.length || !email || !shipping?.name ||
      !shipping.address?.line1 || !shipping.address?.city ||
      !shipping.address?.postal_code || !shipping.address?.country ||
       intent.metadata.policyAcknowledged !== "true" ||
       (items.some(item => isChicagoVariant(item.variantId)) && intent.metadata.decantAcknowledged !== "true")) {
    throw new Error("Payment is missing order details");
  }
  // Stripe metadata is written by our server when creating the intent.
  // Store the original charged cart and amount, not a new client-supplied cart.
  const result = await pool.query(
    `INSERT INTO payment_orders
       (payment_intent_id, amount_cents, currency, customer_email, customer_name, items, shipping)
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
     ON CONFLICT (payment_intent_id) DO UPDATE SET payment_intent_id = EXCLUDED.payment_intent_id
     RETURNING id, amount_cents, customer_email, customer_name`,
    [intent.id, intent.amount_received, intent.currency, email, shipping.name,
      JSON.stringify(items), JSON.stringify(shipping)],
  );
  return result.rows[0] as { id: string; amount_cents: number; customer_email: string; customer_name: string };
}