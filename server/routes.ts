import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get featured product (active or first available)
  app.get("/api/product", async (req, res) => {
    try {
      const product = await storage.getActiveProduct();
      if (!product) {
        // If no active product, get the first product (could be sold out for showcase)
        const allProducts = await storage.getAllProducts();
        if (allProducts.length > 0) {
          return res.json(allProducts[0]);
        }
        return res.status(404).json({ message: "No product found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching product: " + error.message });
    }
  });

  // PayPal routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Handle PayPal payment completion
  app.post("/api/complete-paypal-payment", async (req, res) => {
    try {
      const { paypalOrderId, productId, customerEmail, customerName, policyAcknowledged } = req.body;
      
      if (!policyAcknowledged) {
        return res.status(400).json({ message: "Policy acknowledgment required" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.remainingInventory <= 0) {
        return res.status(400).json({ message: "Product out of stock" });
      }

      // Create order record
      const order = await storage.createOrder({
        productId,
        customerEmail,
        customerName,
        paypalOrderId,
        amount: product.price,
        policyAcknowledged,
      });
      
      // Update order status to completed
      await storage.updateOrderStatus(order.id, "completed");
      
      // Decrease inventory
      await storage.updateProductInventory(
        productId, 
        product.remainingInventory - 1
      );

      res.json({ success: true, orderId: order.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error completing payment: " + error.message });
    }
  });

  // Get inventory count
  app.get("/api/inventory/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ 
        remaining: product.remainingInventory,
        total: product.totalInventory 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching inventory: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
