import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import express from "express";
import Stripe from "stripe";
import { chicagoOffers } from "../shared/chicago";
import { registerStripeWebhook } from "./stripeWebhook";
import { attachChicagoIntent, getUnavailableQuantities, reconcileExpiredReservations,
  recordPaidOrder, releaseUnattachedChicago, reserveChicago, reserveChicagoCheckout,
  getOrCreateChicagoIntent, CheckoutConflict, handlePaymentIntentNotification } from "./payments";

test("concurrent retries share a hold and intent; a new purchase gets its own", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const item = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const key = randomUUID();
  const otherKey = randomUUID();
  const held: string[] = [];
  let creations = 0;
  const stripe = {
    paymentIntents: {
      create: async () => {
        creations++;
        await new Promise(resolve => setTimeout(resolve, 30));
        return { id: `pi_retry_test_${key.replaceAll("-", "")}`, status: "requires_payment_method", client_secret: "test_secret" };
      },
      retrieve: async (id: string) => ({ id, status: "requires_payment_method", client_secret: "test_secret" }),
    },
  } as unknown as Stripe;
  try {
    const before = await getUnavailableQuantities();
    assert.ok((before.get(item[0].variantId) ?? 0) <= 23, "Test requires two available decants");
    const attempts = await Promise.all(Array.from({ length: 3 },
      () => reserveChicagoCheckout(item, undefined, stripe, key, "same-request")));
    assert.equal(new Set(attempts.map(a => a.reservationId)).size, 1);
    held.push(attempts[0].reservationId);
    const params = { amount: attempts[0].amount, currency: "usd" } as const;
    const intents = await Promise.all(attempts.map(a => getOrCreateChicagoIntent(a.reservationId, stripe, params)));
    assert.equal(new Set(intents.map(intent => intent.id)).size, 1);
    assert.equal(creations, 1);
    await assert.rejects(
      reserveChicagoCheckout(item, undefined, stripe, key, "changed-request"), CheckoutConflict);
    const another = await reserveChicagoCheckout(item, undefined, stripe, otherKey, "same-request");
    held.push(another.reservationId);
    assert.notEqual(another.reservationId, held[0]);
    const after = await getUnavailableQuantities();
    assert.equal(after.get(item[0].variantId), (before.get(item[0].variantId) ?? 0) + 2);
  } finally {
    await pool.query("UPDATE chicago_reservations SET status = 'released' WHERE id = ANY($1::uuid[])", [held]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = ANY($1::uuid[])", [held]);
    await pool.end();
  }
});

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

function paidIntent(id: string, reservationId: string, items: { variantId: string; quantity: number }[]) {
  return {
    id, status: "succeeded", currency: "usd", amount: 5999, amount_received: 5999,
    receipt_email: "test@example.invalid",
    shipping: { name: "Test Buyer", address: { line1: "1 Test St", city: "Chicago", postal_code: "60601", country: "US" } },
    metadata: { items: JSON.stringify(items), policyAcknowledged: "true",
      decantAcknowledged: "true", chicagoReservationId: reservationId },
  } as Stripe.PaymentIntent;
}

test("webhook rejects unsigned or forged HTTP events before touching orders or stock", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const before = (await getUnavailableQuantities()).get(items[0].variantId) ?? 0;
  const id = (await reserveChicago(items, { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_webhook_test_${id.replaceAll("-", "")}`;
  const intent = paidIntent(intentId, id, items);
  const signer = new Stripe("sk_test_webhook_fixture");
  const secret = "whsec_local_webhook_fixture";
  let verifications = 0;
  let retrievals = 0;
  const app = express();
  registerStripeWebhook(app, {
    getSync: async () => ({
      processWebhook: async (payload, signature) => {
        verifications++;
        assert.ok(Buffer.isBuffer(payload), "Signature verification must receive the raw request body");
        signer.webhooks.constructEvent(payload, signature!, secret);
      },
    }),
    getClient: async () => ({
      paymentIntents: { retrieve: async () => { retrievals++; return intent; } },
    }) as unknown as Stripe,
  });
  // JSON parsing elsewhere in the app must not consume the webhook body first.
  app.use(express.json());
  const server = app.listen(0, "127.0.0.1");
  try {
    await new Promise<void>(resolve => server.once("listening", resolve));
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const url = `http://127.0.0.1:${address.port}/api/stripe/webhook`;
    await attachChicagoIntent(id, intentId);
    const body = JSON.stringify({
      id: `evt_${randomUUID().replaceAll("-", "")}`,
      type: "payment_intent.succeeded",
      data: { object: { id: intentId } },
    });
    const signed = signer.webhooks.generateTestHeaderString({ payload: body, secret });
    const send = (payload: string, signature?: string) => fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(signature ? { "stripe-signature": signature } : {}) },
      body: payload,
    });
    for (const [payload, signature] of [
      [body, undefined],
      [body, "t=123,v1=forged"],
      [body.replace("payment_intent.succeeded", "payment_intent.canceled"), signed],
    ] as const) {
      const response = await send(payload, signature);
      assert.equal(response.status, 400);
      assert.equal(retrievals, 0, "Unverified events must not reach the payment handler");
      assert.equal((await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id])).rows[0].status, "pending");
      assert.equal((await pool.query(
        "SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1", [intentId],
      )).rows[0].count, 0);
      assert.equal((await getUnavailableQuantities()).get(items[0].variantId), before + 1);
    }
    assert.equal(verifications, 2, "Missing signatures must not invoke the verifier");
    const response = await send(body, signed);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { received: true });
    assert.equal(verifications, 3);
    assert.equal(retrievals, 1);
    assert.equal((await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id])).rows[0].status, "committed");
    assert.equal((await pool.query(
      "SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1", [intentId],
    )).rows[0].count, 1);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    await pool.query("DELETE FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = $1", [id]);
    await pool.end();
  }
});

test("duplicate and out-of-order notifications use captured state without releasing stock", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const before = (await getUnavailableQuantities()).get(items[0].variantId) ?? 0;
  const id = (await reserveChicago(items, { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_notification_test_${id.replaceAll("-", "")}`;
  const intent = paidIntent(intentId, id, items);
  let cancels = 0;
  const stripe = {
    paymentIntents: {
      retrieve: async () => intent,
      cancel: async () => { cancels++; throw new Error("Captured payment cannot be canceled"); },
    },
  } as unknown as Stripe;
  try {
    await attachChicagoIntent(id, intentId);
    // Failure delivered first, then success twice, then late failure/cancel.
    for (const type of ["payment_intent.payment_failed", "payment_intent.succeeded",
      "payment_intent.succeeded", "payment_intent.canceled", "payment_intent.payment_failed"]) {
      await handlePaymentIntentNotification(stripe, type, intentId);
    }
    assert.equal(cancels, 0);
    assert.equal((await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id])).rows[0].status, "committed");
    assert.equal((await pool.query("SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1",
      [intentId])).rows[0].count, 1);
    assert.equal((await getUnavailableQuantities()).get(items[0].variantId), before + 1);
  } finally {
    await pool.query("DELETE FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = $1", [id]);
    await pool.end();
  }
});

test("canceled payment frees its hold despite duplicate and late success notifications", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const before = (await getUnavailableQuantities()).get(items[0].variantId) ?? 0;
  const id = (await reserveChicago(items, { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_notification_test_${id.replaceAll("-", "")}`;
  const canceled = { ...paidIntent(intentId, id, items), status: "canceled" };
  let status = "requires_payment_method";
  let cancels = 0;
  const stripe = {
    paymentIntents: {
      retrieve: async () => ({ ...canceled, status }),
      cancel: async () => { cancels++; status = "canceled"; return canceled; },
    },
  } as unknown as Stripe;
  try {
    await attachChicagoIntent(id, intentId);
    for (const type of ["payment_intent.payment_failed", "payment_intent.payment_failed",
      "payment_intent.canceled", "payment_intent.succeeded", "payment_intent.canceled"]) {
      await handlePaymentIntentNotification(stripe, type, intentId);
    }
    assert.equal(cancels, 1);
    assert.equal((await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id])).rows[0].status, "released");
    assert.equal((await pool.query("SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1",
      [intentId])).rows[0].count, 0);
    assert.equal((await getUnavailableQuantities()).get(items[0].variantId) ?? 0, before);
  } finally {
    await pool.query("DELETE FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = $1", [id]);
    await pool.end();
  }
});

test("capture during expiry cancellation commits stock even when success notification waits for the lock", async () => {
  if (process.env.NODE_ENV === "production") throw new Error("Never run inventory tests on production");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items = [{ variantId: chicagoOffers[0].variantId, quantity: 1 }];
  const before = (await getUnavailableQuantities()).get(items[0].variantId) ?? 0;
  const id = (await reserveChicago(items, { paymentIntents: {} } as Stripe))!;
  const intentId = `pi_notification_test_${id.replaceAll("-", "")}`;
  const captured = paidIntent(intentId, id, items);
  let status = "requires_payment_method";
  let enterCancel!: () => void;
  let finishCancel!: () => void;
  const cancelStarted = new Promise<void>(resolve => { enterCancel = resolve; });
  const allowCancel = new Promise<void>(resolve => { finishCancel = resolve; });
  const stripe = {
    paymentIntents: {
      retrieve: async () => ({ ...captured, status }),
      cancel: async () => {
        enterCancel();
        await allowCancel;
        // Cancellation loses the race: Stripe captured the payment instead.
        status = "succeeded";
        throw new Error("Cannot cancel a succeeded payment");
      },
    },
  } as unknown as Stripe;
  try {
    await attachChicagoIntent(id, intentId);
    await pool.query("UPDATE chicago_reservations SET expires_at = now() - interval '1 second' WHERE id = $1", [id]);
    const expiry = reconcileExpiredReservations(stripe);
    await cancelStarted;
    const notification = handlePaymentIntentNotification(stripe, "payment_intent.succeeded", intentId);
    finishCancel();
    await Promise.all([expiry, notification]);
    assert.equal((await pool.query("SELECT status FROM chicago_reservations WHERE id = $1", [id])).rows[0].status, "committed");
    assert.equal((await pool.query("SELECT count(*)::integer AS count FROM payment_orders WHERE payment_intent_id = $1",
      [intentId])).rows[0].count, 1);
    assert.equal((await getUnavailableQuantities()).get(items[0].variantId), before + 1);
  } finally {
    finishCancel();
    await pool.query("DELETE FROM payment_orders WHERE payment_intent_id = $1", [intentId]);
    await pool.query("DELETE FROM chicago_reservations WHERE id = $1", [id]);
    await pool.end();
  }
});