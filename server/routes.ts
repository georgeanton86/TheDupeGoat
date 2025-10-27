import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe with LIVE keys
if (!process.env.STRIPE_LIVE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_LIVE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
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
      res.json(allVariants);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product variants: " + error.message });
    }
  });

  // Get variants for a specific product
  app.get("/api/product-variants/:productId", async (req, res) => {
    try {
      const variants = await storage.getProductVariants(req.params.productId);
      res.json(variants);
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
      res.json(variant);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product variant: " + error.message });
    }
  });

  // Stripe payment intent creation - SECURE: calculates server total from cart using variant IDs
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { items, promoCode } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: "No items in cart" });
      }

      // CRITICAL: Validate quantities are positive integers
      for (const item of items) {
        if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 100) {
          return res.status(400).json({ error: "Invalid quantities" });
        }
      }

      // SERVER-SIDE RECALCULATION - NEVER TRUST CLIENT PRICES
      let serverSubtotal = 0;
      for (const item of items) {
        const variant = await storage.getProductVariant(item.variantId);
        if (!variant) {
          return res.status(404).json({ error: `Product variant ${item.variantId} not found` });
        }
        serverSubtotal += parseFloat(variant.price) * item.quantity;
      }

      // Validate promo code
      let serverDiscount = 0;
      if (promoCode && promoCode.toUpperCase() === "WELCOME10") {
        serverDiscount = serverSubtotal * 0.1;
      }

      // Calculate shipping
      const serverShipping = serverSubtotal >= 100 ? 0 : 8.99;
      const serverTotal = serverSubtotal - serverDiscount + serverShipping;

      if (serverTotal <= 0) {
        return res.status(400).json({ error: "Invalid total" });
      }

      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(serverTotal * 100), // Convert to cents
        currency: "usd",
        metadata: {
          items: JSON.stringify(items),
          promoCode: promoCode || "",
          subtotal: serverSubtotal.toFixed(2),
          discount: serverDiscount.toFixed(2),
          shipping: serverShipping.toFixed(2),
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        total: serverTotal
      });
    } catch (error: any) {
      console.error("Failed to create payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent: " + error.message });
    }
  });

  // Stripe webhook handler for payment completion
  app.post("/api/webhook/stripe", async (req, res) => {
    try {
      // In production, verify webhook signature
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        // Extract metadata
        const items = JSON.parse(paymentIntent.metadata.items || '[]');
        const promoCode = paymentIntent.metadata.promoCode || '';
        
        // Process order (inventory deduction, etc.)
        console.log('Payment succeeded:', paymentIntent.id);
        console.log('Items:', items);
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message });
    }
  });

  // Complete Stripe payment and create order
  app.post("/api/complete-stripe-payment", async (req, res) => {
    try {
      const { 
        paymentIntentId,
        items, 
        customerEmail, 
        customerName, 
        policyAcknowledged,
        promoCode
      } = req.body;
      
      if (!policyAcknowledged) {
        return res.status(400).json({ message: "Policy acknowledgment required" });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ message: "No items in cart" });
      }

      // CRITICAL: Validate all quantities are positive integers
      for (const item of items) {
        if (!item.quantity || !Number.isInteger(item.quantity) || item.quantity <= 0) {
          return res.status(400).json({ 
            message: "Invalid quantity. All quantities must be positive integers." 
          });
        }
        if (item.quantity > 100) {
          return res.status(400).json({ 
            message: "Quantity exceeds maximum allowed per item (100)." 
          });
        }
      }

      // SERVER-SIDE RECALCULATION - NEVER TRUST CLIENT PRICES
      let serverSubtotal = 0;
      const validatedItems = [];

      // Verify all product variants exist, have sufficient inventory, and calculate actual prices
      for (const item of items) {
        const variant = await storage.getProductVariant(item.variantId);
        if (!variant) {
          return res.status(404).json({ message: `Product variant ${item.variantId} not found` });
        }

        if (variant.remainingInventory < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient inventory. Only ${variant.remainingInventory} remaining.` 
          });
        }

        // Calculate line item total from SERVER database, not client
        const lineTotal = parseFloat(variant.price) * item.quantity;
        serverSubtotal += lineTotal;

        validatedItems.push({
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: variant.price,
          lineTotal: lineTotal.toFixed(2),
          variant
        });
      }

      // Validate and apply promo code on SERVER
      let serverDiscount = 0;
      let validPromoCode = null;
      if (promoCode && promoCode.toUpperCase() === "WELCOME10") {
        serverDiscount = serverSubtotal * 0.1;
        validPromoCode = "WELCOME10";
      }

      // Calculate shipping on SERVER
      const serverShipping = serverSubtotal >= 100 ? 0 : 8.99;
      
      // Calculate final total on SERVER
      const serverTotal = serverSubtotal - serverDiscount + serverShipping;

      // CRITICAL: Reject orders with invalid totals
      if (serverTotal <= 0) {
        return res.status(400).json({ 
          message: "Invalid order total. Total must be greater than $0." 
        });
      }

      // CRITICAL SECURITY: Verify payment intent was actually paid using Stripe API
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({ 
            message: "Payment not completed. Please try again." 
          });
        }

        // Verify amount matches our calculated total (allow 1 cent tolerance for rounding)
        const paidAmount = paymentIntent.amount / 100; // Convert from cents
        const capturedCurrency = paymentIntent.currency.toUpperCase();
        
        if (capturedCurrency !== 'USD') {
          return res.status(400).json({ 
            message: "Invalid payment currency. Only USD is accepted." 
          });
        }
        
        if (Math.abs(paidAmount - serverTotal) > 0.01) { // Allow 1 cent rounding
          return res.status(400).json({ 
            message: `Payment amount mismatch. Expected $${serverTotal.toFixed(2)}, received $${paidAmount.toFixed(2)}` 
          });
        }
      } catch (stripeError) {
        console.error("Stripe verification error:", stripeError);
        return res.status(500).json({ 
          message: "Failed to verify payment. Please contact support." 
        });
      }

      // Create order records and update inventory for each item
      const orderIds: string[] = [];
      
      for (const validatedItem of validatedItems) {
        // Create order record for this item with SERVER-calculated price
        const order = await storage.createOrder({
          variantId: validatedItem.variantId,
          customerEmail,
          customerName,
          paypalOrderId: paymentIntentId,
          amount: validatedItem.lineTotal,
          policyAcknowledged,
        });
        
        // Update order status to completed
        await storage.updateOrderStatus(order.id, "completed");
        
        // Decrease inventory
        await storage.updateProductVariantInventory(
          validatedItem.variantId, 
          validatedItem.variant.remainingInventory - validatedItem.quantity
        );

        // Increase sold count
        await storage.updateProductVariantSoldCount(
          validatedItem.variantId,
          validatedItem.variant.soldCount + validatedItem.quantity
        );
        
        orderIds.push(order.id);
      }

      res.json({ 
        success: true, 
        orderIds,
        total: serverTotal.toFixed(2),
        promoCode: validPromoCode 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error completing payment: " + error.message });
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

      res.json({ 
        remaining: variant.remainingInventory,
        total: variant.totalInventory 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching inventory: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
