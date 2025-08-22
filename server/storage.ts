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
      totalInventory: 6000,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2024-08-01"),
      nextReleaseDate: new Date("2025-09-01"),
      selloutTime: "4 minutes 36 seconds",
      createdAt: new Date(),
    };
    this.products.set(soldOutProduct.id, soldOutProduct);

    // Holy No. 5 - Sold Out (inspired by Chanel No. 5)
    const aprilProduct: Product = {
      id: randomUUID(),
      name: "Holy No. 5",
      description: "Our most iconic fragrance celebrating the five sacred wounds. A timeless blend of divine femininity.",
      price: "145.00",
      originalPrice: "145.00",
      volume: "50ml Eau de Parfum",
      notes: "Sacred Lily, Blessed Jasmine, Holy Water Accord",
      type: "Limited Edition - SOLD OUT",
      imageUrl: "@assets/generated_images/April's_Awakening_luxury_perfume_bottle_2eb39dcc.png",
      totalInventory: 850,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-04-01"),
      nextReleaseDate: new Date("2025-04-01"),
      selloutTime: "2 minutes 18 seconds",
      createdAt: new Date("2025-04-01"),
    };
    this.products.set(aprilProduct.id, aprilProduct);

    // RZN - Sold Out (Limited April Release)
    const rznProduct: Product = {
      id: randomUUID(),
      name: "RZN",
      description: "A mysterious and powerful fragrance. Pure essence distilled to its divine core.",
      price: "165.00",
      originalPrice: "165.00",
      volume: "50ml Eau de Parfum",
      notes: "Sacred Amber, Divine Musk, Blessed Sandalwood",
      type: "Limited Edition - SOLD OUT",
      imageUrl: "@assets/generated_images/RZN_luxury_perfume_bottle_890ac3f2.png",
      totalInventory: 250,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-04-15"),
      nextReleaseDate: new Date("2025-04-15"),
      selloutTime: "3 minutes 42 seconds",
      createdAt: new Date("2025-04-15"),
    };
    this.products.set(rznProduct.id, rznProduct);

    // Angel's Embrace - Sold Out (inspired by Angel by Thierry Mugler)
    const mayProduct: Product = {
      id: randomUUID(),
      name: "Angel's Embrace",
      description: "A heavenly fragrance that wraps you in divine protection and celestial love.",
      price: "125.00",
      originalPrice: "125.00", 
      volume: "50ml Eau de Parfum",
      notes: "Divine Rose, Sacred Cedar, Blessed Sandalwood",
      type: "Limited Edition - SOLD OUT",
      imageUrl: "@assets/generated_images/May's_Mystique_luxury_perfume_bottle_de71f6d0.png",
      totalInventory: 1200,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-05-01"),
      nextReleaseDate: new Date("2025-05-01"),
      selloutTime: "7 minutes 45 seconds",
      createdAt: new Date("2025-05-01"),
    };
    this.products.set(mayProduct.id, mayProduct);

    // Sacred Waters - Sold Out (inspired by Acqua di Gio)
    const juneProduct: Product = {
      id: randomUUID(),
      name: "Sacred Waters",
      description: "Pure as holy water, fresh as divine breath. A unisex fragrance blessed by sacred springs.",
      price: "135.00",
      originalPrice: "135.00",
      volume: "50ml Eau de Parfum", 
      notes: "Heavenly Lavender, Sacred Bergamot, Divine Amber",
      type: "Limited Edition - SOLD OUT",
      imageUrl: "@assets/generated_images/June's_Journey_luxury_perfume_bottle_9dff73d4.png",
      totalInventory: 2000,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-06-01"),
      nextReleaseDate: new Date("2025-06-01"),
      selloutTime: "12 minutes 3 seconds",
      createdAt: new Date("2025-06-01"),
    };
    this.products.set(juneProduct.id, juneProduct);

    // Divine Opium - Sold Out (inspired by Black Opium)
    const julyProduct: Product = {
      id: randomUUID(),
      name: "Divine Opium",
      description: "Intoxicatingly spiritual. A bold fragrance for those drunk on divine love.",
      price: "155.00",
      originalPrice: "155.00",
      volume: "50ml Eau de Parfum",
      notes: "Golden Saffron, Sacred Oud, Blessed Vanilla",
      type: "Limited Edition - SOLD OUT", 
      imageUrl: "@assets/generated_images/July's_Jewel_luxury_perfume_bottle_872dd6a6.png",
      totalInventory: 500,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-07-01"),
      nextReleaseDate: new Date("2025-07-01"),
      selloutTime: "1 minute 27 seconds",
      createdAt: new Date("2025-07-01"),
    };
    this.products.set(julyProduct.id, julyProduct);

    // Heavenly Sauvage - Sold Out (inspired by Sauvage)
    const augustProduct: Product = {
      id: randomUUID(),
      name: "Heavenly Sauvage", 
      description: "Wild and untamed faith. A masculine fragrance for spiritual warriors.",
      price: "140.00",
      originalPrice: "140.00",
      volume: "50ml Eau de Parfum",
      notes: "Blessed Orange Blossom, Sacred Neroli, Holy Musk",
      type: "Limited Edition - SOLD OUT",
      imageUrl: "@assets/generated_images/August's_Allure_luxury_perfume_bottle_f9cf7a85.png", 
      totalInventory: 3500,
      remainingInventory: 0,
      isActive: false,
      releaseDate: new Date("2025-08-01"),
      nextReleaseDate: new Date("2025-08-01"),
      selloutTime: "18 minutes 52 seconds",
      createdAt: new Date("2025-08-01"),
    };
    this.products.set(augustProduct.id, augustProduct);

    // Coming soon pre-order product
    const preOrderProduct: Product = {
      id: randomUUID(),
      name: "September's Noir",
      description: "A divine fragrance inspired by faith and grace. This sophisticated noir blend captures the essence of autumn's mystique with sacred ingredients.",
      price: "99.00",
      originalPrice: "129.00",
      volume: "50ml Eau de Parfum",
      notes: "Sacred Frankincense, Blessed Myrrh, Holy Rose",
      type: "Limited Pre-Order",
      imageUrl: "@assets/generated_images/Black_September's_Noir_luxury_perfume_8e9e72db.png",
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
