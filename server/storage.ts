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
    // THE SEAL
    const theSeal: Product = {
      id: randomUUID(),
      name: "THE SEAL",
      description: "A transformative fragrance that marks you as chosen. Divine protection in a bottle.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "Do not harm until we seal the servants of God",
      verseReference: "Revelation 7:3",
      totalInventory: 100,
      remainingInventory: 23,
      soldCount: 77,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theSeal.id, theSeal);

    // THE CROWN
    const theCrown: Product = {
      id: randomUUID(),
      name: "THE CROWN",
      description: "For those faithful unto death. Wear the crown of life with this regal fragrance.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "Be faithful unto death, I will give you the crown of life",
      verseReference: "Revelation 2:10",
      totalInventory: 100,
      remainingInventory: 45,
      soldCount: 55,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theCrown.id, theCrown);

    // OMEGA
    const omega: Product = {
      id: randomUUID(),
      name: "OMEGA",
      description: "The beginning and the end. Alpha and Omega captured in divine essence.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "I am the Alpha and the Omega, the beginning and the end",
      verseReference: "Revelation 1:8",
      totalInventory: 100,
      remainingInventory: 12,
      soldCount: 88,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(omega.id, omega);

    // THE LAMB
    const theLamb: Product = {
      id: randomUUID(),
      name: "THE LAMB",
      description: "Worthy is the Lamb. A fragrance of sacrifice, redemption, and ultimate victory.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "Worthy is the Lamb who was slain",
      verseReference: "Revelation 5:12",
      totalInventory: 100,
      remainingInventory: 67,
      soldCount: 33,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theLamb.id, theLamb);

    // REDEEMED
    const redeemed: Product = {
      id: randomUUID(),
      name: "REDEEMED",
      description: "Ransomed by blood. A fragrance of freedom and divine purchase.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "By your blood you ransomed people for God",
      verseReference: "Revelation 5:9",
      totalInventory: 100,
      remainingInventory: 89,
      soldCount: 11,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(redeemed.id, redeemed);

    // THE SCROLL
    const theScroll: Product = {
      id: randomUUID(),
      name: "THE SCROLL",
      description: "Sealed with seven seals. The mystery of God revealed in fragrance.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "A scroll sealed with seven seals",
      verseReference: "Revelation 5:1",
      totalInventory: 100,
      remainingInventory: 31,
      soldCount: 69,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theScroll.id, theScroll);

    // CONQUERED
    const conquered: Product = {
      id: randomUUID(),
      name: "CONQUERED",
      description: "Victory fragrance for overcomers. Sit with Christ on His throne.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "To the one who conquers I will grant to sit on my throne",
      verseReference: "Revelation 3:21",
      totalInventory: 100,
      remainingInventory: 54,
      soldCount: 46,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(conquered.id, conquered);

    // THE TREE
    const theTree: Product = {
      id: randomUUID(),
      name: "THE TREE",
      description: "Tree of life bearing twelve kinds of fruit. Healing for the nations.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "The tree of life bearing twelve kinds of fruit",
      verseReference: "Revelation 22:2",
      totalInventory: 100,
      remainingInventory: 76,
      soldCount: 24,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theTree.id, theTree);

    // ANOINTED
    const anointed: Product = {
      id: randomUUID(),
      name: "ANOINTED",
      description: "Your head anointed with oil. Overflow with divine blessing.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "You anoint my head with oil, my cup overflows",
      verseReference: "Psalm 23:5",
      totalInventory: 100,
      remainingInventory: 8,
      soldCount: 92,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(anointed.id, anointed);

    // GLORY
    const glory: Product = {
      id: randomUUID(),
      name: "GLORY",
      description: "The glory of God illuminated. The Lamb is its lamp.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "The glory of God gives it light, and its lamp is the Lamb",
      verseReference: "Revelation 21:23",
      totalInventory: 100,
      remainingInventory: 19,
      soldCount: 81,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(glory.id, glory);

    // THE WORD
    const theWord: Product = {
      id: randomUUID(),
      name: "THE WORD",
      description: "In the beginning was the Word. Divine essence made manifest.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "In the beginning was the Word, and the Word was God",
      verseReference: "John 1:1",
      totalInventory: 100,
      remainingInventory: 42,
      soldCount: 58,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theWord.id, theWord);

    // LIVING WATER
    const livingWater: Product = {
      id: randomUUID(),
      name: "LIVING WATER",
      description: "From the spring of the water of life. Freely given, divinely blessed.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "I will give from the spring of the water of life freely",
      verseReference: "Revelation 21:6",
      totalInventory: 100,
      remainingInventory: 5,
      soldCount: 95,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(livingWater.id, livingWater);

    // THE ROAR
    const theRoar: Product = {
      id: randomUUID(),
      name: "THE ROAR",
      description: "Like the roar of a lion. Bold, powerful, unstoppable.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "He gave a loud shout like the roar of a lion",
      verseReference: "Revelation 10:3",
      totalInventory: 100,
      remainingInventory: 63,
      soldCount: 37,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theRoar.id, theRoar);

    // CONSECRATED
    const consecrated: Product = {
      id: randomUUID(),
      name: "CONSECRATED",
      description: "Set apart as most holy. Divine consecration in fragrance form.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "Consecrate them, that they may be most holy",
      verseReference: "Exodus 30:30",
      totalInventory: 100,
      remainingInventory: 38,
      soldCount: 62,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(consecrated.id, consecrated);

    // THE FIRE
    const theFire: Product = {
      id: randomUUID(),
      name: "THE FIRE",
      description: "Eyes like flames of fire. Burning intensity and divine passion.",
      price: "35.00",
      originalPrice: null,
      volume: "30ml Eau de Parfum",
      notes: "Notes to be revealed",
      type: "Biblical Collection",
      imageUrl: "@assets/generated_images/Luxury_Summer_of_Singhs_perfume_dfd15174.png",
      bibleVerse: "His eyes were like a flame of fire",
      verseReference: "Revelation 1:14",
      totalInventory: 100,
      remainingInventory: 28,
      soldCount: 72,
      isActive: true,
      releaseDate: new Date("2025-01-01"),
      nextReleaseDate: null,
      selloutTime: null,
      createdAt: new Date(),
    };
    this.products.set(theFire.id, theFire);
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
