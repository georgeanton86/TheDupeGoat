import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runMigrations } from "stripe-replit-sync";
import { getStripeClient, getStripeSync } from "./stripeClient";
import { recordPaidOrder } from "./payments";

const app = express();

async function initializeStripeIntegration() {
  try {
    const sync = await getStripeSync();
    const domain = process.env.REPLIT_DOMAINS?.split(",")[0];
    if (!domain) throw new Error("REPLIT_DOMAINS is required for Stripe webhooks");
    await sync.findOrCreateManagedWebhook(`https://${domain}/api/stripe/webhook`);
    void sync.syncBackfill({ object: "all" }).catch(error => console.error("Stripe sync backfill failed:", error));
  } catch (error) {
    console.error("Stripe webhook setup failed; storefront is online but payment notifications may be unavailable:", error);
  }
}

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string" || !Buffer.isBuffer(req.body))
    return res.status(400).json({ message: "Invalid webhook" });
  try {
    // StripeSync verifies the raw payload and signature before we inspect it.
    const sync = await getStripeSync();
    await sync.processWebhook(req.body, signature);
    const event = JSON.parse(req.body.toString("utf8"));
    if (event.type === "payment_intent.succeeded") {
      const stripe = await getStripeClient();
      const intent = await stripe.paymentIntents.retrieve(event.data.object.id);
      await recordPaidOrder(intent);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook failed:", error);
    res.status(400).json({ message: "Webhook could not be processed" });
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached_assets at /assets route
app.use("/assets", express.static(path.resolve(import.meta.dirname, "..", "attached_assets")));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && ![
        "/api/stripe/config", "/api/create-payment-intent",
        "/api/complete-stripe-payment",
      ].includes(reqPath)) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  await runMigrations({ databaseUrl: process.env.DATABASE_URL });
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    // A slow Stripe webhook request must not hold the storefront closed during cold starts.
    void initializeStripeIntegration();
  });
})();
