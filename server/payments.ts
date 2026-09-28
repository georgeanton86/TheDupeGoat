import { Pool, type PoolClient } from "pg";
import type Stripe from "stripe";
import { storage } from "./storage";
import { chicagoSetDiscountCents, countChicagoSets, isChicagoVariant } from "@shared/chicago";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for orders");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export type CartLine = { variantId: string; quantity: number };
const chicagoLock = 54182025;

async function withChicagoLock<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [chicagoLock]);
    const result = await action(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function quantities(query: Pool | PoolClient, includePending: boolean): Promise<Map<string, number>> {
  const result = await query.query(
    `SELECT variant_id, SUM(quantity)::integer AS sold FROM (
       SELECT line->>'variantId' AS variant_id, (line->>'quantity')::integer AS quantity
       FROM payment_orders, LATERAL jsonb_array_elements(items) AS line
       ${includePending ? `UNION ALL
       SELECT line->>'variantId', (line->>'quantity')::integer
       FROM chicago_reservations, LATERAL jsonb_array_elements(items) AS line
       WHERE status = 'pending'` : ""}
     ) AS stock GROUP BY variant_id`,
  );
  return new Map(result.rows.map(row => [row.variant_id, row.sold]));
}

export async function getPaidQuantities(): Promise<Map<string, number>> {
  return quantities(pool, false);
}

export async function getUnavailableQuantities(): Promise<Map<string, number>> {
  return quantities(pool, true);
}

export async function reserveChicago(items: CartLine[], stripe: Stripe): Promise<string | undefined> {
  const decants = items.filter(item => isChicagoVariant(item.variantId));
  if (!decants.length) return undefined;
  // Never discard an expired hold without first establishing that Stripe
  // cannot still capture its payment.
  await reconcileExpiredReservations(stripe);
  return withChicagoLock(async client => {
    const unavailable = await quantities(client, true);
    for (const item of decants) {
      const variant = await storage.getProductVariant(item.variantId);
      if (!variant?.isActive || variant.remainingInventory - (unavailable.get(item.variantId) ?? 0) < item.quantity)
        throw new Error("Insufficient inventory");
    }
    const result = await client.query(
      `INSERT INTO chicago_reservations (items, expires_at)
       VALUES ($1::jsonb, now() + interval '30 minutes') RETURNING id`,
      [JSON.stringify(decants)],
    );
    return result.rows[0].id as string;
  });
}

export async function attachChicagoIntent(reservationId: string, intentId: string) {
  const result = await pool.query(
    `UPDATE chicago_reservations SET payment_intent_id = $2
     WHERE id = $1 AND status = 'pending' AND payment_intent_id IS NULL RETURNING id`,
    [reservationId, intentId],
  );
  if (!result.rowCount) throw new Error("Reservation is no longer available");
}

export async function releaseUnattachedChicago(reservationId: string) {
  await pool.query(
    `UPDATE chicago_reservations SET status = 'released'
     WHERE id = $1 AND status = 'pending' AND payment_intent_id IS NULL`,
    [reservationId],
  );
}

export async function reconcileExpiredReservations(stripe: Stripe) {
  await withChicagoLock(async client => {
    const expired = await client.query(
      `SELECT id, payment_intent_id FROM chicago_reservations
       WHERE status = 'pending' AND expires_at <= now() ORDER BY created_at`,
    );
    for (const row of expired.rows) {
      if (!row.payment_intent_id) {
        await client.query("UPDATE chicago_reservations SET status = 'released' WHERE id = $1", [row.id]);
        continue;
      }
      try {
        await reconcileIntentLocked(client, stripe, row.payment_intent_id, true);
      } catch (error) {
        // A Stripe outage or an uncancelable processing payment must keep its
        // stock held, rather than risking a second buyer paying for it.
        console.error("Could not reconcile expired reservation:", row.id, error);
      }
    }
  });
}

async function reconcileIntentLocked(client: PoolClient, stripe: Stripe, intentId: string, cancel: boolean) {
  let intent = await stripe.paymentIntents.retrieve(intentId);
  if (intent.status === "succeeded") {
    await recordPaidOrderLocked(client, intent);
  } else if (intent.status === "canceled") {
    await client.query(
      `UPDATE chicago_reservations SET status = 'released'
       WHERE payment_intent_id = $1 AND status = 'pending'`, [intentId],
    );
  } else if (cancel) {
    // A successful cancellation is the point at which the hold becomes safe
    // to release. If Stripe rejects it, keep the hold for a later retry.
    try {
      intent = await stripe.paymentIntents.cancel(intentId);
    } catch (error) {
      intent = await stripe.paymentIntents.retrieve(intentId);
      if (intent.status !== "succeeded" && intent.status !== "canceled") throw error;
    }
    if (intent.status === "succeeded") await recordPaidOrderLocked(client, intent);
    else if (intent.status === "canceled")
      await client.query(
        `UPDATE chicago_reservations SET status = 'released'
         WHERE payment_intent_id = $1 AND status = 'pending'`, [intentId],
      );
  }
}

export async function reconcileChicagoIntent(stripe: Stripe, intentId: string, cancel = false) {
  await withChicagoLock(client => reconcileIntentLocked(client, stripe, intentId, cancel));
}

export async function priceCart(items: CartLine[], promoCode?: string) {
  let subtotalCents = 0;
  const paid = await getUnavailableQuantities();
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
  return withChicagoLock(client => recordPaidOrderLocked(client, intent));
}

async function recordPaidOrderLocked(client: PoolClient, intent: Stripe.PaymentIntent) {
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
  if (items.some(item => isChicagoVariant(item.variantId))) {
    const reservation = await client.query(
      `SELECT items, status, payment_intent_id FROM chicago_reservations WHERE id = $1`,
      [intent.metadata.chicagoReservationId ?? ""],
    );
    const row = reservation.rows[0];
    const decants = items.filter(item => isChicagoVariant(item.variantId));
    const reserved = row?.items as CartLine[] | undefined;
    if (!row || row.payment_intent_id !== intent.id ||
        !["pending", "committed"].includes(row.status) ||
        !Array.isArray(reserved) || reserved.length !== decants.length ||
        !decants.every((item, index) =>
          reserved[index]?.variantId === item.variantId && reserved[index]?.quantity === item.quantity))
      throw new Error("Payment has no matching inventory reservation");
    await client.query(
      `UPDATE chicago_reservations SET status = 'committed'
       WHERE id = $1 AND status = 'pending'`, [intent.metadata.chicagoReservationId],
    );
  }
  // Stripe metadata is written by our server when creating the intent.
  // Store the original charged cart and amount, not a new client-supplied cart.
  const result = await client.query(
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