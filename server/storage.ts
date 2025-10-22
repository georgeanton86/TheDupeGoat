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
    // THE SEVEN SEALS COLLECTION
    // Sequential release strategy: One seal at a time, starting with EQUUS ALBUS
    // Next seal releases when previous seal sells out
    
    // FIRST SEAL - EQUUS ALBUS (White Horse) - NOW AVAILABLE
    const equusAlbusEdP: Product = {
      id: randomUUID(),
      name: "EQUUS ALBUS",
      description: "Conquest & awakening. Ride forth with divine purpose and unstoppable momentum.",
      price: "99.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Eau de Parfum",
      notes: "A luminous blend of fresh citrus, exotic florals, and warm woody base notes",
      topNotes: "Bergamot, Pineapple, Lemon, Mandarin, Black Currant",
      middleNotes: "Jasmine, Neroli, Orange Blossom, Saffron, Birch",
      baseNotes: "Amberwood, Musk, Oakmoss, Cedar, Vanilla",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png",
      bibleVerse: "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him",
      verseReference: "Revelation 6:1–2",
      totalInventory: 100,
      remainingInventory: 82,
      soldCount: 18,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(equusAlbusEdP.id, equusAlbusEdP);

    const equusAlbusExtrait: Product = {
      id: randomUUID(),
      name: "EQUUS ALBUS",
      description: "Conquest & awakening. Ride forth with divine purpose and unstoppable momentum.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "A luminous blend of fresh citrus, exotic florals, and warm woody base notes",
      topNotes: "Bergamot, Pineapple, Lemon, Mandarin, Black Currant",
      middleNotes: "Jasmine, Neroli, Orange Blossom, Saffron, Birch",
      baseNotes: "Amberwood, Musk, Oakmoss, Cedar, Vanilla",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png",
      bibleVerse: "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him",
      verseReference: "Revelation 6:1–2",
      totalInventory: 50,
      remainingInventory: 41,
      soldCount: 9,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(equusAlbusExtrait.id, equusAlbusExtrait);

    // SECOND SEAL - PAX OBSCURA (Red Horse) - PRE-ORDER (Releases after EQUUS ALBUS sells out)
    const paxObscuraEdP: Product = {
      id: randomUUID(),
      name: "PAX OBSCURA",
      description: "Passion & chaos. When peace is taken from the earth, intensity remains.",
      price: "99.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Eau de Parfum",
      notes: "Smoky Spice, Leather",
      topNotes: "Black Pepper, Cardamom, Pink Pepper",
      middleNotes: "Leather, Smoky Incense, Dark Rose",
      baseNotes: "Amber, Patchouli, Vetiver",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png",
      bibleVerse: "Out came another horse, bright red. Its rider was permitted to take peace from the earth",
      verseReference: "Revelation 6:3–4",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2025-12-31"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(paxObscuraEdP.id, paxObscuraEdP);

    const paxObscuraExtrait: Product = {
      id: randomUUID(),
      name: "PAX OBSCURA",
      description: "Passion & chaos. When peace is taken from the earth, intensity remains.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "Smoky Spice, Leather",
      topNotes: "Black Pepper, Cardamom, Pink Pepper",
      middleNotes: "Leather, Smoky Incense, Dark Rose",
      baseNotes: "Amber, Patchouli, Vetiver",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png",
      bibleVerse: "Out came another horse, bright red. Its rider was permitted to take peace from the earth",
      verseReference: "Revelation 6:3–4",
      totalInventory: 50,
      remainingInventory: 50,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2025-12-31"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(paxObscuraExtrait.id, paxObscuraExtrait);

    // THIRD SEAL - FAMES (Black Horse) - PRE-ORDER
    const famesEdP: Product = {
      id: randomUUID(),
      name: "FAMES",
      description: "Desire & restraint. A haunting reminder of what we crave and cannot have.",
      price: "99.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Eau de Parfum",
      notes: "Dry Woods, Vetiver, Black Pepper",
      topNotes: "Black Pepper, Cardamom, Ginger",
      middleNotes: "Vetiver, Cedarwood, Patchouli",
      baseNotes: "Dry Woods, Leather, Musk",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Fames_luxury_bottle_fd04fa9c.png",
      bibleVerse: "I looked, and behold, a black horse! And its rider had a pair of scales in his hand",
      verseReference: "Revelation 6:5–6",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2026-06-30"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(famesEdP.id, famesEdP);

    // FOURTH SEAL - MORTEM (Pale Horse) - PRE-ORDER
    // FIFTH SEAL - VOX CAELI - PRE-ORDER
    // SIXTH SEAL - TERRA TREMOR - PRE-ORDER
    // SEVENTH SEAL - SABBATUM - PRE-ORDER
    // LUX AETERNA (Eternal Light) - PRE-ORDER
    
    // Additional seals will be added as sequential releases continue
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
      isActive: insertProduct.isActive ?? true,
      selloutTime: insertProduct.selloutTime ?? null,
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
