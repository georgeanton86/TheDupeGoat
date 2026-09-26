import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

// Publishing installs live keys under the standard Stripe variable names.
// Older projects may still have the legacy *_LIVE_* production pair.
function credentials() {
  const production = process.env.NODE_ENV === "production";
  const pairs = production
    ? [
        [process.env.STRIPE_SECRET_KEY, process.env.VITE_STRIPE_PUBLIC_KEY],
        [process.env.STRIPE_LIVE_SECRET_KEY, process.env.VITE_STRIPE_LIVE_PUBLIC_KEY],
      ]
    : [[process.env.STRIPE_SECRET_KEY, process.env.VITE_STRIPE_PUBLIC_KEY]];
  const secretPrefix = production ? "sk_live_" : "sk_test_";
  const publicPrefix = production ? "pk_live_" : "pk_test_";
  const pair = pairs.find(([secret, publicKey]) =>
    secret?.startsWith(secretPrefix) && publicKey?.startsWith(publicPrefix));
  if (!pair) throw new Error(`Stripe ${production ? "live" : "test"} keys are not configured as a matching pair`);
  return { secretKey: pair[0]!, publishableKey: pair[1]! };
}

export async function getStripeClient() {
  return new Stripe(credentials().secretKey);
}

export async function getStripePublishableKey() {
  return credentials().publishableKey;
}

export async function getStripeSync() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const { secretKey } = credentials();
  return new StripeSync({
    poolConfig: { connectionString: process.env.DATABASE_URL },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: "",
  });
}