import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  volume: text("volume").notNull(),
  notes: text("notes").notNull(),
  type: text("type").notNull(),
  imageUrl: text("image_url").notNull(),
  bibleVerse: text("bible_verse").notNull(),
  verseReference: text("verse_reference").notNull(),
  totalInventory: integer("total_inventory").notNull(),
  remainingInventory: integer("remaining_inventory").notNull(),
  soldCount: integer("sold_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  releaseDate: timestamp("release_date").notNull(),
  nextReleaseDate: timestamp("next_release_date"),
  selloutTime: text("sellout_time"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  paypalOrderId: text("paypal_order_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  policyAcknowledged: boolean("policy_acknowledged").notNull().default(false),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
