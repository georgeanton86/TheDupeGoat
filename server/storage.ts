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
  updateProductSoldCount(id: string, soldCount: number): Promise<Product | undefined>;
  
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
    // MEN'S COLOGNES (4)
    
    // THE WARRIOR
    const theWarrior: Product = {
      id: randomUUID(),
      name: "THE WARRIOR",
      description: "Bold. Powerful. Untamed. A fierce fragrance for the modern warrior with divine strength.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Cologne",
      notes: "Calabrian Bergamot, Sichuan Pepper, Ambroxan, Vanilla",
      type: "Men's Cologne",
      imageUrl: "/the-warrior.png",
      bibleVerse: "Blessed be the LORD, my rock, who trains my hands for war",
      verseReference: "Psalm 144:1",
      totalInventory: 100,
      remainingInventory: 18,
      soldCount: 82,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theWarrior.id, theWarrior);

    // THE KING
    const theKing: Product = {
      id: randomUUID(),
      name: "THE KING",
      description: "Regal. Sophisticated. Timeless. The scent of wisdom and divine royalty.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Cologne",
      notes: "Pineapple, Blackcurrant, Birch, Oakmoss, Musk",
      type: "Men's Cologne",
      imageUrl: "/the-king.png",
      bibleVerse: "Blessed is the one who finds wisdom, more precious than gold",
      verseReference: "Proverbs 3:13-14",
      totalInventory: 100,
      remainingInventory: 27,
      soldCount: 73,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theKing.id, theKing);

    // THE ROCK
    const theRock: Product = {
      id: randomUUID(),
      name: "THE ROCK",
      description: "Steadfast. Elegant. Unwavering. Built on the foundation of faith and strength.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Cologne",
      notes: "Citrus, Ginger, Sandalwood, Cedar, Vetiver",
      type: "Men's Cologne",
      imageUrl: "/the-rock.png",
      bibleVerse: "You are Peter, and on this rock I will build my church",
      verseReference: "Matthew 16:18",
      totalInventory: 100,
      remainingInventory: 41,
      soldCount: 59,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theRock.id, theRock);

    // THE BELOVED
    const theBeloved: Product = {
      id: randomUUID(),
      name: "THE BELOVED",
      description: "Seductive. Passionate. Cherished. The fragrance of divine love and devotion.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Cologne",
      notes: "Mint, Green Apple, Tonka Bean, Vanilla, Oakmoss",
      type: "Men's Cologne",
      imageUrl: "/the-beloved.png",
      bibleVerse: "One of his disciples, whom Jesus loved, was reclining next to him",
      verseReference: "John 13:23",
      totalInventory: 100,
      remainingInventory: 53,
      soldCount: 47,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theBeloved.id, theBeloved);

    // UNISEX PERFUMES (4)

    // THE PROPHET
    const theProphet: Product = {
      id: randomUUID(),
      name: "THE PROPHET",
      description: "Mystic. Visionary. Transcendent. The voice of divine revelation in fragrance form.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Sandalwood, Cardamom, Iris, Violet, Leather",
      type: "Unisex Perfume",
      imageUrl: "/the-prophet.png",
      bibleVerse: "I heard the voice of the Lord saying, 'Whom shall I send?'",
      verseReference: "Isaiah 6:8",
      totalInventory: 100,
      remainingInventory: 12,
      soldCount: 88,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theProphet.id, theProphet);

    // THE SHIELD
    const theShield: Product = {
      id: randomUUID(),
      name: "THE SHIELD",
      description: "Protective. Resilient. Empowering. Divine armor against all adversity.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Leather, Jasmine Sambac, Amber, Patchouli, Moss",
      type: "Unisex Perfume",
      imageUrl: "/the-shield.png",
      bibleVerse: "Take up the shield of faith to extinguish the flaming arrows",
      verseReference: "Ephesians 6:16",
      totalInventory: 100,
      remainingInventory: 34,
      soldCount: 66,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theShield.id, theShield);

    // THE CROWN
    const theCrown: Product = {
      id: randomUUID(),
      name: "THE CROWN",
      description: "Victorious. Radiant. Eternal. The crown of righteousness awaits the faithful.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Black Cherry, Bitter Almond, Tonka Bean, Sandalwood",
      type: "Unisex Perfume",
      imageUrl: "/the-crown.png",
      bibleVerse: "There is laid up for me the crown of righteousness",
      verseReference: "2 Timothy 4:8",
      totalInventory: 100,
      remainingInventory: 9,
      soldCount: 91,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theCrown.id, theCrown);

    // THE LIGHT
    const theLight: Product = {
      id: randomUUID(),
      name: "THE LIGHT",
      description: "Luminous. Ethereal. Pure. Walk in the light as He is in the light.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Lavender, Coconut, Vanilla, Praline, Musk",
      type: "Unisex Perfume",
      imageUrl: "/the-light.png",
      bibleVerse: "I am the light of the world. Whoever follows me will never walk in darkness",
      verseReference: "John 8:12",
      totalInventory: 100,
      remainingInventory: 15,
      soldCount: 85,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theLight.id, theLight);
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
      originalPrice: insertProduct.originalPrice ?? null,
      nextReleaseDate: insertProduct.nextReleaseDate ?? null,
      soldCount: insertProduct.soldCount ?? 0,
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

  async updateProductSoldCount(id: string, soldCount: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      product.soldCount = soldCount;
      this.products.set(id, product);
      return product;
    }
    return undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder,
      policyAcknowledged: insertOrder.policyAcknowledged ?? false,
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
