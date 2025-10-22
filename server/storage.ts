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
    
    // EQUUS ALBUS - White Horse
    const theWarrior: Product = {
      id: randomUUID(),
      name: "EQUUS ALBUS",
      description: "Conquest & awakening. Ride forth with divine purpose and unstoppable momentum.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Bright Amber, White Musk, Citrus",
      type: "Unisex Perfume",
      imageUrl: "/equus-albus.png",
      bibleVerse: "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him",
      verseReference: "Revelation 6:1–2",
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

    // PAX OBSCURA - Darkened Peace
    const theKing: Product = {
      id: randomUUID(),
      name: "PAX OBSCURA",
      description: "Passion & chaos. When peace is taken from the earth, intensity remains.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Smoky Spice, Leather",
      type: "Unisex Perfume",
      imageUrl: "/pax-obscura.png",
      bibleVerse: "Out came another horse, bright red. Its rider was permitted to take peace from the earth",
      verseReference: "Revelation 6:3–4",
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

    // FAMES - Famine
    const theRock: Product = {
      id: randomUUID(),
      name: "FAMES",
      description: "Desire & restraint. A haunting reminder of what we crave and cannot have.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Dry Woods, Vetiver, Black Pepper",
      type: "Unisex Perfume",
      imageUrl: "/fames.png",
      bibleVerse: "I looked, and behold, a black horse! And its rider had a pair of scales in his hand",
      verseReference: "Revelation 6:5–6",
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

    // MORTEM - Death
    const theBeloved: Product = {
      id: randomUUID(),
      name: "MORTEM",
      description: "Stillness & eternity. Face the inevitable with grace and sacred reverence.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Incense, Cedar, Myrrh",
      type: "Unisex Perfume",
      imageUrl: "/mortem.png",
      bibleVerse: "I looked, and behold, a pale horse! And its rider's name was Death",
      verseReference: "Revelation 6:7–8",
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

    // VOX CAELI - Voice of Heaven
    const theProphet: Product = {
      id: randomUUID(),
      name: "VOX CAELI",
      description: "Prayer & transcendence. The martyrs cry out beneath the altar of heaven.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "White Oud, Soft Smoke",
      type: "Unisex Perfume",
      imageUrl: "/vox-caeli.png",
      bibleVerse: "I saw under the altar the souls of those who had been slain for the word of God",
      verseReference: "Revelation 6:9–11",
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

    // TERRA TREMOR - Earth Tremor
    const theShield: Product = {
      id: randomUUID(),
      name: "TERRA TREMOR",
      description: "Power & awe. When the earth shakes and the heavens tremble before Him.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Amber, Patchouli, Volcanic Depth",
      type: "Unisex Perfume",
      imageUrl: "/terra-tremor.png",
      bibleVerse: "There was a great earthquake, and the sun became black as sackcloth",
      verseReference: "Revelation 6:12–17",
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

    // SABBATUM - The Silence
    const theCrown: Product = {
      id: randomUUID(),
      name: "SABBATUM",
      description: "Sacred stillness. When heaven fell silent for half an hour, all creation held its breath.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Sandalwood, Linen, White Iris",
      type: "Unisex Perfume",
      imageUrl: "/sabbatum.png",
      bibleVerse: "When the Lamb opened the seventh seal, there was silence in heaven for about half an hour",
      verseReference: "Revelation 8:1",
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

    // LUX AETERNA - Eternal Light (Bonus)
    const theLight: Product = {
      id: randomUUID(),
      name: "LUX AETERNA",
      description: "Completion & resurrection. The radiant glory that remains when all seals are broken.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Golden Woods, Radiant Amber",
      type: "Unisex Perfume",
      imageUrl: "/lux-aeterna.png",
      bibleVerse: "The city has no need of sun or moon, for the glory of God gives it light",
      verseReference: "Revelation 21:23",
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
