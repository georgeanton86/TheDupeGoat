import express, { type Express } from "express";
import type Stripe from "stripe";
import { getStripeClient, getStripeSync } from "./stripeClient";
import { handlePaymentIntentNotification } from "./payments";

type WebhookDependencies = {
  getSync: () => Promise<{ processWebhook(payload: Buffer | string, signature: string | undefined): Promise<void> }>;
  getClient: () => Promise<Stripe>;
};

export function registerStripeWebhook(
  app: Express,
  { getSync, getClient }: WebhookDependencies = { getSync: getStripeSync, getClient: getStripeClient },
) {
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string" || !Buffer.isBuffer(req.body))
      return res.status(400).json({ message: "Invalid webhook" });
    try {
      // StripeSync verifies the raw payload and signature before we inspect it.
      const sync = await getSync();
      await sync.processWebhook(req.body, signature);
      const event = JSON.parse(req.body.toString("utf8"));
      if (event.type === "payment_intent.succeeded" ||
          event.type === "payment_intent.canceled" ||
          event.type === "payment_intent.payment_failed") {
        await handlePaymentIntentNotification(await getClient(), event.type, event.data.object.id);
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Stripe webhook failed:", error);
      res.status(400).json({ message: "Webhook could not be processed" });
    }
  });
}