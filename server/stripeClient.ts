import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

// The connected Stripe account uses the workspace's environment-scoped keys.
// Never use the live keys in development.
function credentials() {
  const production = process.env.NODE_ENV === "production";
  const secretKey = production ? process.env.STRIPE_LIVE_SECRET_KEY : process.env.STRIPE_SECRET_KEY;
  const publishableKey = production ? process.env.VITE_STRIPE_LIVE_PUBLIC_KEY : process.env.VITE_STRIPE_PUBLIC_KEY;
  if (!secretKey || !publishableKey) throw new Error("Stripe keys are not configured for this environment");
  if (!secretKey.startsWith(production ? "sk_live_" : "sk_test_") ||
      !publishableKey.startsWith(production ? "pk_live_" : "pk_test_"))
    throw new Error("Stripe keys must match the current environment's payment mode");
  return { secretKey, publishableKey };
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