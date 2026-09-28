import { test } from "node:test";
import assert from "node:assert/strict";
import { Pool } from "pg";
import type Stripe from "stripe";
import { chicagoOffers } from "../shared/chicago";
import { attachChicagoIntent, getUnavailableQuantities, reconcileExpiredReservations,
  recordPaidOrder, releaseUnattachedChicago, reserveChicago } from "./payments";

test("Chicago sets and individual purchases cannot reserve more than 25 per fragrance", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const held: string[] = [];
  const stripe = { paymentIntents: { retrieve: async () => ({ status: "canceled" }) } } as unknown as Stripe;
  try {
    const unavailable = await getUnavailableQuantities();
    const available = chicagoOffers.map(offer => 25 - (unavailable.get(offer.variantId) ?? 0));
    assert.ok(available.every(quantity => quantity >= 2), "Test requires at least two available decants of each fragrance");
    // A cart with all three scents is the three-piece set; its quantities
    // compete with separate individual carts for the same underlying stock.
    const set = chicagoOffers.map((offer, index) =>
      ({ variantId: offer.variantId, quantity: available[index] - 1 }));
    held.push((await reserveChicago(set, stripe))!);
    const individual = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
    const attempts = await Promise.allSettled([
      reserveChicago(individual, stripe), reserveChicago(individual, stripe),
    ]);
    const successes = attempts.filter(result => result.status === "fulfilled");
    assert.equal(successes.length, 1);
    held.push((successes[0] as PromiseFulfilledResult<string>).value);
    assert.match((attempts.find(result => result.status === "rejected") as PromiseRejectedResult).reason.message,
      /Insufficient inventory/);
    const nowUnavailable = await getUnavailableQuantities();
    assert.equal(nowUnavailable.get(chicagoOffers[0].variantId), 25);
  } finally {
    await Promise.all(held.map(id => releaseUnattachedChicago(id)));
    await pool.end();
  }
});

test("expired attached holds release only after Stripe confirms cancellation", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const id = (await reserveChicago([{ variantId: chicagoOffers[0].variantId, quantity: 1 }],
    { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_reservation_test_${id.replaceAll("-", "")}`;
  try {
    await attachChicagoIntent(id, intentId);
    await pool.query("UPDATE chicago_reservations SET expires_at = now() - interval '1 second' WHERE id = $1", [id]);
    const stripe = {
      paymentIntents: {
        retrieve: async () => ({ status: "requires_payment_method" }),
        cancel: async () => ({ status: "canceled" }),
      },
    } as unknown as Stripe;
    await reconcileExpiredReservations(stripe);
    const result = await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id]);
    assert.equal(result.rows[0].status, "released");
  } finally {
    // A failed assertion must not leave a test reservation consuming stock.
    await pool.query("UPDATE chicago_reservations SET status = 'released' WHERE id = $1", [id]);
    await pool.end();
  }
});

test("a successful payment commits its hold and records only one order", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const id = (await reserveChicago(items, { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_reservation_test_${id.replaceAll("-", "")}`;
  try {
    await attachChicagoIntent(id, intentId);
    const intent = {
      id: intentId, status: "succeeded", currency: "usd", amount: 5999, amount_received: 5999,
      receipt_email: "test@example.invalid",
      shipping: { name: "Test Buyer", address: { line1: "1 Test St", city: "Chicago", postal_code: "60601", country: "US" } },
      metadata: { items: JSON.stringify(items), policyAcknowledged: "true",
        decantAcknowledged: "true", chicagoReservationId: id },
    } as unknown as Stripe.PaymentIntent;
    const first = await recordPaidOrder(intent);
    const second = await recordPaidOrder(intent);
    assert.equal(first.id, second.id);
    const rows = await pool.query(
      "SELECT status FROM chicago_reservations WHERE id = $1", [id]);
    assert.equal(rows.rows[0].status, "committed");
    const orders = await pool.query(
      "SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    assert.equal(orders.rows[0].count, 1);
  } finally {
    await pool.query("DELETE FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = $1", [id]);
    await pool.end();
  }
});