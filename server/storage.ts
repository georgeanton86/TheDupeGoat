import { type User, type InsertUser, type Product, type InsertProduct, type ProductVariant, type InsertProductVariant, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProduct(id: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  getProductVariant(id: string): Promise<ProductVariant | undefined>;
  getProductVariantBySku(sku: string): Promise<ProductVariant | undefined>;
  getProductVariants(productId: string): Promise<ProductVariant[]>;
  getAllProductVariants(): Promise<ProductVariant[]>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariantInventory(id: string, remainingInventory: number): Promise<ProductVariant | undefined>;
  updateProductVariantSoldCount(id: string, soldCount: number): Promise<ProductVariant | undefined>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByPaypalOrderId(paypalOrderId: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private productVariants: Map<string, ProductVariant>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.productVariants = new Map();
    this.orders = new Map();
    
    // Initialize with all 8 fragrances and their variants
    this.initializeProducts();
  }

  private initializeProducts() {
    // THE SEVEN SEALS COLLECTION - All 8 fragrances available now
    
    const fragrances = [
      {
        name: "EQUUS ALBUS",
        description: "Conquest & awakening. Ride forth with divine purpose and unstoppable momentum.",
        notes: "Bright Amber, White Musk, Citrus",
        topNotes: "Bergamot, Pineapple, Lemon, Mandarin, Black Currant",
        middleNotes: "Jasmine, Neroli, Orange Blossom, Saffron, Birch",
        baseNotes: "Amberwood, Musk, Oakmoss, Cedar, Vanilla",
        imageUrl: "/assets/generated_images/Badass_Equus_Albus_bottle_bde8545f.png",
        bibleVerse: "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him",
        verseReference: "Revelation 6:1–2",
      },
      {
        name: "PAX OBSCURA",
        description: "Passion & chaos. When peace is taken from the earth, intensity remains.",
        notes: "Smoky Spice, Leather",
        topNotes: "Black Pepper, Cardamom, Pink Pepper",
        middleNotes: "Leather, Smoky Incense, Dark Rose",
        baseNotes: "Amber, Patchouli, Vetiver",
        imageUrl: "/assets/generated_images/Pax_Obscura_luxury_bottle_c6928f90.png",
        bibleVerse: "Out came another horse, bright red. Its rider was permitted to take peace from the earth",
        verseReference: "Revelation 6:3–4",
      },
      {
        name: "FAMES",
        description: "Desire & restraint. A haunting reminder of what we crave and cannot have.",
        notes: "Dry Woods, Vetiver, Black Pepper",
        topNotes: "Black Pepper, Cardamom, Ginger",
        middleNotes: "Vetiver, Cedarwood, Patchouli",
        baseNotes: "Dry Woods, Leather, Musk",
        imageUrl: "/assets/generated_images/Fames_luxury_bottle_fd04fa9c.png",
        bibleVerse: "I looked, and behold, a black horse! And its rider had a pair of scales in his hand",
        verseReference: "Revelation 6:5–6",
      },
      {
        name: "MORTEM",
        description: "Stillness & eternity. The final horseman brings profound peace.",
        notes: "Incense, Cedar, Myrrh",
        topNotes: "Frankincense, Myrrh, Cardamom",
        middleNotes: "Cedarwood, Incense, Oud",
        baseNotes: "Sandalwood, Amber, Musk",
        imageUrl: "/assets/generated_images/Mortem_luxury_bottle_f077a9fa.png",
        bibleVerse: "I looked, and behold, a pale horse! And its rider's name was Death",
        verseReference: "Revelation 6:7–8",
      },
      {
        name: "VOX CAELI",
        description: "Prayer & transcendence. The voice of heaven rises above earthly chaos.",
        notes: "White Oud, Soft Smoke",
        topNotes: "White Oud, Bergamot, Lavender",
        middleNotes: "Incense, Rose, Jasmine",
        baseNotes: "Sandalwood, Amber, Vanilla",
        imageUrl: "/assets/generated_images/Vox_Caeli_luxury_bottle_6b8efdf7.png",
        bibleVerse: "I saw under the altar the souls of those who had been slain for the word of God",
        verseReference: "Revelation 6:9–11",
      },
      {
        name: "TERRA TREMOR",
        description: "Power & awe. When the earth shakes, only the strongest foundations remain.",
        notes: "Amber, Patchouli, Volcanic Depth",
        topNotes: "Volcanic Rock, Black Pepper, Grapefruit",
        middleNotes: "Patchouli, Amber, Geranium",
        baseNotes: "Oakmoss, Vetiver, Musk",
        imageUrl: "/assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png",
        bibleVerse: "There was a great earthquake, and the sun became black as sackcloth",
        verseReference: "Revelation 6:12–17",
      },
      {
        name: "SABBATUM",
        description: "Sacred stillness. When heaven falls silent, divinity speaks.",
        notes: "Sandalwood, Linen, White Iris",
        topNotes: "White Iris, Linen, Bergamot",
        middleNotes: "Sandalwood, White Rose, Violet",
        baseNotes: "Cashmere Woods, Musk, Vanilla",
        imageUrl: "/assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png",
        bibleVerse: "When the Lamb opened the seventh seal, there was silence in heaven for about half an hour",
        verseReference: "Revelation 8:1",
      },
      {
        name: "LUX AETERNA",
        description: "Completion & resurrection. The eternal light that never fades.",
        notes: "Golden Woods, Radiant Amber",
        topNotes: "Golden Amber, Saffron, Orange Blossom",
        middleNotes: "Radiant Oud, Jasmine, Rose",
        baseNotes: "Sandalwood, Amberwood, White Musk",
        imageUrl: "/assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png",
        bibleVerse: "The city has no need of sun or moon, for the glory of God gives it light",
        verseReference: "Revelation 21:23",
      }
    ];

    // Create each fragrance product
    fragrances.forEach((fragrance, index) => {
      const productId = randomUUID();
      const product: Product = {
        id: productId,
        name: fragrance.name,
        description: fragrance.description,
        notes: fragrance.notes,
        topNotes: fragrance.topNotes,
        middleNotes: fragrance.middleNotes,
        baseNotes: fragrance.baseNotes,
        type: "Unisex Perfume",
        imageUrl: fragrance.imageUrl,
        bibleVerse: fragrance.bibleVerse,
        verseReference: fragrance.verseReference,
        isActive: true,
        releaseDate: new Date("2024-01-01"),
        createdAt: new Date(),
      };
      this.products.set(productId, product);

      // Create 6 variants for each fragrance
      const variants = [
        { size: "100mL", concentration: "Eau de Parfum", price: "99.99" },
        { size: "100mL", concentration: "Extrait de Parfum", price: "119.99" },
        { size: "50mL", concentration: "Eau de Parfum", price: "49.99" },
        { size: "50mL", concentration: "Extrait de Parfum", price: "69.99" },
        { size: "10mL", concentration: "Pure Oil Roll-on", price: "19.99" },
        { size: "30mL", concentration: "Pure Oil Roll-on", price: "34.99" },
      ];

      variants.forEach((v) => {
        const variantId = randomUUID();
        const sku = `${fragrance.name.replace(/\s+/g, '-')}-${v.size.replace(/[^0-9]/g, '')}-${v.concentration.replace(/\s+/g, '-').substring(0, 3).toUpperCase()}`;
        
        const variant: ProductVariant = {
          id: variantId,
          productId: productId,
          sku: sku,
          size: v.size,
          concentration: v.concentration,
          price: v.price,
          totalInventory: 100,
          remainingInventory: index === 0 && v.concentration === "Extrait de Parfum" && v.size === "100mL" ? 82 : 100,
          soldCount: index === 0 && v.concentration === "Extrait de Parfum" && v.size === "100mL" ? 18 : 0,
          isActive: true,
          createdAt: new Date(),
        };
        this.productVariants.set(variantId, variant);
      });
    });
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

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct,
      isActive: insertProduct.isActive ?? true,
      id,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductVariant(id: string): Promise<ProductVariant | undefined> {
    return this.productVariants.get(id);
  }

  async getProductVariantBySku(sku: string): Promise<ProductVariant | undefined> {
    return Array.from(this.productVariants.values()).find(
      (variant) => variant.sku === sku
    );
  }

  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values()).filter(
      (variant) => variant.productId === productId
    );
  }

  async getAllProductVariants(): Promise<ProductVariant[]> {
    return Array.from(this.productVariants.values());
  }

  async createProductVariant(insertVariant: InsertProductVariant): Promise<ProductVariant> {
    const id = randomUUID();
    const variant: ProductVariant = {
      ...insertVariant,
      soldCount: insertVariant.soldCount ?? 0,
      isActive: insertVariant.isActive ?? true,
      id,
      createdAt: new Date(),
    };
    this.productVariants.set(id, variant);
    return variant;
  }

  async updateProductVariantInventory(id: string, remainingInventory: number): Promise<ProductVariant | undefined> {
    const variant = this.productVariants.get(id);
    if (variant) {
      variant.remainingInventory = remainingInventory;
      this.productVariants.set(id, variant);
      return variant;
    }
    return undefined;
  }

  async updateProductVariantSoldCount(id: string, soldCount: number): Promise<ProductVariant | undefined> {
    const variant = this.productVariants.get(id);
    if (variant) {
      variant.soldCount = soldCount;
      this.productVariants.set(id, variant);
      return variant;
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
