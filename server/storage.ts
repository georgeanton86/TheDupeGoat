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
    // THE SEVEN SEALS COLLECTION - All 8 fragrances available now
    
    // FIRST SEAL - EQUUS ALBUS (White Horse)
    const equusAlbus: Product = {
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
      totalInventory: 100,
      remainingInventory: 82,
      soldCount: 18,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(equusAlbus.id, equusAlbus);

    // SECOND SEAL - PAX OBSCURA (Red Horse)
    const paxObscura: Product = {
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
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(paxObscura.id, paxObscura);

    // THIRD SEAL - FAMES (Black Horse)
    const fames: Product = {
      id: randomUUID(),
      name: "FAMES",
      description: "Desire & restraint. A haunting reminder of what we crave and cannot have.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
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
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(fames.id, fames);

    // FOURTH SEAL - MORTEM (Pale Horse)
    const mortem: Product = {
      id: randomUUID(),
      name: "MORTEM",
      description: "Stillness & eternity. The final horseman brings profound peace.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "Incense, Cedar, Myrrh",
      topNotes: "Frankincense, Myrrh, Cardamom",
      middleNotes: "Cedarwood, Incense, Oud",
      baseNotes: "Sandalwood, Amber, Musk",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Mortem_luxury_bottle_f077a9fa.png",
      bibleVerse: "I looked, and behold, a pale horse! And its rider's name was Death",
      verseReference: "Revelation 6:7–8",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(mortem.id, mortem);

    // FIFTH SEAL - VOX CAELI
    const voxCaeli: Product = {
      id: randomUUID(),
      name: "VOX CAELI",
      description: "Prayer & transcendence. The voice of heaven rises above earthly chaos.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "White Oud, Soft Smoke",
      topNotes: "White Oud, Bergamot, Lavender",
      middleNotes: "Incense, Rose, Jasmine",
      baseNotes: "Sandalwood, Amber, Vanilla",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png",
      bibleVerse: "I saw under the altar the souls of those who had been slain for the word of God",
      verseReference: "Revelation 6:9–11",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(voxCaeli.id, voxCaeli);

    // SIXTH SEAL - TERRA TREMOR
    const terraTremor: Product = {
      id: randomUUID(),
      name: "TERRA TREMOR",
      description: "Power & awe. When the earth shakes, only the strongest foundations remain.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "Amber, Patchouli, Volcanic Depth",
      topNotes: "Volcanic Rock, Black Pepper, Grapefruit",
      middleNotes: "Patchouli, Amber, Geranium",
      baseNotes: "Oakmoss, Vetiver, Musk",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png",
      bibleVerse: "There was a great earthquake, and the sun became black as sackcloth",
      verseReference: "Revelation 6:12–17",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(terraTremor.id, terraTremor);

    // SEVENTH SEAL - SABBATUM
    const sabbatum: Product = {
      id: randomUUID(),
      name: "SABBATUM",
      description: "Sacred stillness. When heaven falls silent, divinity speaks.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "Sandalwood, Linen, White Iris",
      topNotes: "White Iris, Linen, Bergamot",
      middleNotes: "Sandalwood, White Rose, Violet",
      baseNotes: "Cashmere Woods, Musk, Vanilla",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png",
      bibleVerse: "When the Lamb opened the seventh seal, there was silence in heaven for about half an hour",
      verseReference: "Revelation 8:1",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(sabbatum.id, sabbatum);

    // LUX AETERNA (Eternal Light)
    const luxAeterna: Product = {
      id: randomUUID(),
      name: "LUX AETERNA",
      description: "Completion & resurrection. The eternal light that never fades.",
      price: "119.00",
      originalPrice: null,
      volume: "100mL",
      concentration: "Extrait de Parfum",
      notes: "Golden Woods, Radiant Amber",
      topNotes: "Golden Amber, Saffron, Orange Blossom",
      middleNotes: "Radiant Oud, Jasmine, Rose",
      baseNotes: "Sandalwood, Amberwood, White Musk",
      type: "Unisex Perfume",
      imageUrl: "/assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png",
      bibleVerse: "The city has no need of sun or moon, for the glory of God gives it light",
      verseReference: "Revelation 21:23",
      totalInventory: 100,
      remainingInventory: 100,
      soldCount: 0,
      isActive: true,
      releaseDate: new Date("2024-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(luxAeterna.id, luxAeterna)
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
    // Prioritize currently available products (release date has passed)
    // Return EQUUS ALBUS first (the current release)
    const currentProduct = Array.from(this.products.values()).find(
      (product) => product.isActive && new Date(product.releaseDate) <= new Date() && product.remainingInventory > 0
    );
    
    if (currentProduct) return currentProduct;
    
    // If no current products, show next pre-order
    return Array.from(this.products.values()).find(
      (product) => product.isActive && new Date(product.releaseDate) > new Date()
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
