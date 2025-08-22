import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getActiveProduct(): Promise<Product | undefined>;
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductInventory(id: string, remainingInventory: number): Promise<Product | undefined>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByPaypalOrderId(paypalOrderId: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    
    // Initialize with featured product
    this.initializeDefaultProduct();
  }

  private async initializeDefaultProduct() {
    // Sold out success story
    const soldOutProduct: Product = {
      id: randomUUID(),
      name: "Summer of Singhs",
      description: "A captivating fragrance collection celebrating elegance and sophistication. Available in both pour femme and pour homme editions.",
      price: "285.00",
      originalPrice: "350.00",
      volume: "50ml Eau de Parfum",
      notes: "Golden Florals, Warm Amber, Luxurious Musk",
      type: "Unisex Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      totalInventory: 600,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2024-08-01"),
      nextReleaseDate: new Date("2025-09-01"),
      createdAt: new Date(),
    };
    this.products.set(soldOutProduct.id, soldOutProduct);

    // Coming soon pre-order product
    const preOrderProduct: Product = {
      id: randomUUID(),
      name: "September's Seduction",
      description: "Our most anticipated release yet. A mysterious and alluring fragrance that captures the essence of late summer nights and autumn's promise.",
      price: "99.00",
      originalPrice: "129.00",
      volume: "50ml Eau de Parfum",
      notes: "Dark Cherry, Smoky Vanilla, Midnight Rose",
      type: "Limited Pre-Order",
      imageUrl: "@assets/generated_images/September's_Seduction_luxury_perfume_52de12ac.png",
      totalInventory: 100,
      remainingInventory: 100,
      isActive: true,
      releaseDate: new Date("2025-09-01"),
      nextReleaseDate: new Date("2025-09-01"),
      createdAt: new Date(),
    };
    this.products.set(preOrderProduct.id, preOrderProduct);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getActiveProduct(): Promise<Product | undefined> {
    // Return pre-order product if available, otherwise any active product
    const preOrderProduct = Array.from(this.products.values()).find(
      (product) => product.isActive && new Date(product.releaseDate) > new Date()
    );
    
    if (preOrderProduct) return preOrderProduct;
    
    return Array.from(this.products.values()).find(
      (product) => product.isActive && product.remainingInventory > 0
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async updateProductInventory(id: string, remainingInventory: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      product.remainingInventory = remainingInventory;
      this.products.set(id, product);
      return product;
    }
    return undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderByPaypalOrderId(paypalOrderId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.paypalOrderId === paypalOrderId
    );
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
      return order;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
