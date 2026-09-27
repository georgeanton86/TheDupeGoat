import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { getStripeClient, getStripePublishableKey } from "./stripeClient";
import { getPaidQuantities, priceCart, recordPaidOrder } from "./payments";
import { isChicagoVariant } from "@shared/chicago";

const checkoutSchema = z.object({
  items: z.array(z.object({
    variantId: z.string().min(1),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(30).refine(
    items => new Set(items.map(item => item.variantId)).size === items.length,
    "Duplicate items are not allowed",
  ),
  promoCode: z.string().max(40).optional().nullable(),
  customerEmail: z.string().email().max(254),
  customerName: z.string().trim().min(1).max(100),
  policyAcknowledged: z.literal(true),
  decantAcknowledged: z.boolean().optional(),
  address: z.object({
    line1: z.string().trim().min(1).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(1).max(100),
    state: z.string().trim().min(1).max(100),
    postal_code: z.string().trim().min(1).max(30),
    country: z.literal("US"),
  }),
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all products (base fragrances)
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching products: " + error.message });
    }
  });

  // Get featured product (first product - EQUUS ALBUS)
  app.get("/api/product", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      if (allProducts.length === 0) {
        return res.status(404).json({ message: "No products available" });
      }
      // Return the first product (EQUUS ALBUS)
      res.json(allProducts[0]);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Get single product by ID
  app.get("/api/product/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // Get all product variants
  app.get("/api/product-variants", async (req, res) => {
    try {
      const allVariants = await storage.getAllProductVariants();
      const paid = await getPaidQuantities();
      res.json(allVariants.map(v => ({
        ...v,
        remainingInventory: Math.max(0, v.remainingInventory - (paid.get(v.id) ?? 0)),
        soldCount: v.soldCount + (paid.get(v.id) ?? 0),
      })));
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product variants: " + error.message });
    }
  });

  // Get variants for a specific product
  app.get("/api/product-variants/:productId", async (req, res) => {
    try {
      const variants = await storage.getProductVariants(req.params.productId);
      const paid = await getPaidQuantities();
      res.json(variants.map(v => ({
        ...v,
        remainingInventory: Math.max(0, v.remainingInventory - (paid.get(v.id) ?? 0)),
        soldCount: v.soldCount + (paid.get(v.id) ?? 0),
      })));
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product variants: " + error.message });
    }
  });

  // Get single variant by ID
  app.get("/api/variant/:id", async (req, res) => {
    try {
      const variant = await storage.getProductVariant(req.params.id);
      if (!variant) {
        return res.status(404).json({ message: "Product variant not found" });
      }
      const paid = await getPaidQuantities();
      res.json({
        ...variant,
        remainingInventory: Math.max(0, variant.remainingInventory - (paid.get(variant.id) ?? 0)),
        soldCount: variant.soldCount + (paid.get(variant.id) ?? 0),
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product variant: " + error.message });
    }
  });

  app.get("/api/stripe/config", async (_req, res) => {
    try {
      res.json({ publishableKey: await getStripePublishableKey() });
    } catch (error) {
      console.error("Stripe configuration error:", error);
      res.status(503).json({ message: "Payments are unavailable" });
    }
  });

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const parsed = checkoutSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid checkout details", details: parsed.error.flatten() });
      const { items, promoCode, customerEmail, customerName, address } = parsed.data;
      if (items.some(item => isChicagoVariant(item.variantId)) && parsed.data.decantAcknowledged !== true)
        return res.status(400).json({ message: "Please acknowledge the decant bottle disclosure" });
      const amount = await priceCart(items, promoCode ?? undefined);
      const stripe = await getStripeClient();
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        receipt_email: customerEmail,
        shipping: { name: customerName, address },
        metadata: {
          items: JSON.stringify(items),
          promoCode: promoCode?.toUpperCase() === "WELCOME10" ? "WELCOME10" : "",
          policyAcknowledged: "true",
          decantAcknowledged: parsed.data.decantAcknowledged === true ? "true" : "false",
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret, total: amount / 100 });
    } catch (error) {
      console.error("Failed to create payment intent:", error);
      res.status(error instanceof Error && /inventory|available/i.test(error.message) ? 400 : 503)
        .json({ message: error instanceof Error && /inventory|available/i.test(error.message) ? error.message : "Could not start payment" });
    }
  });

  // The client secret proves possession of this specific payment; never accept
  // order totals, cart contents or customer identity from the confirmation call.
  app.post("/api/complete-stripe-payment", async (req, res) => {
    try {
      const { paymentIntentId, clientSecret } = z.object({
        paymentIntentId: z.string().regex(/^pi_[a-zA-Z0-9]+$/),
        clientSecret: z.string().min(10),
      }).parse(req.body);
      const stripe = await getStripeClient();
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!intent.client_secret || intent.client_secret !== clientSecret)
        return res.status(403).json({ message: "Invalid payment confirmation" });
      if (intent.status !== "succeeded")
        return res.status(409).json({ message: "Payment is not complete yet" });
      const order = await recordPaidOrder(intent);
      res.json({ success: true, orderId: order.id, total: (order.amount_cents / 100).toFixed(2),
        customerEmail: order.customer_email, customerName: order.customer_name });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid payment confirmation" });
      console.error("Payment confirmation failed:", error);
      res.status(503).json({ message: "Payment status could not be confirmed. Please retry; do not pay again." });
    }
  });

  // Get inventory count for a variant
  app.get("/api/inventory/:variantId", async (req, res) => {
    try {
      const { variantId } = req.params;
      const variant = await storage.getProductVariant(variantId);
      
      if (!variant) {
        return res.status(404).json({ message: "Product variant not found" });
      }

      const paid = await getPaidQuantities();
      res.json({
        remaining: Math.max(0, variant.remainingInventory - (paid.get(variant.id) ?? 0)),
        total: variant.totalInventory 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching inventory: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
