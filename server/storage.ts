import { type User, type InsertUser, type Product, type InsertProduct, type ProductVariant, type InsertProductVariant, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";
import { chicagoOffers } from "@shared/chicago";

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
        description: "Bright pineapple-citrus opening with a green woody heart and a smoky amber-musk base.",
        notes: "Fruity Smoky Woods",
        topNotes: "Bergamot Grapefruit, Rainforest Hibiscus, Birch Tree & Fig",
        middleNotes: "Smoky Pineapple Accord, Alpine Cheer, Bergamot Tobacco",
        baseNotes: "Cedar & Aged Oak, Salted Amber, Smoked Cardamom, Aurora Dawn",
        imageUrl: "/assets/file_00000000a04071f5b21d7e763cb4b1fc_1764980262870.png",
        bibleVerse: "I looked, and behold, a white horse! And its rider had a bow, and a crown was given to him",
        verseReference: "Revelation 6:1–2",
      },
      {
        name: "PAX OBSCURA",
        description: "Cool citrus and aquatic top, aromatic heart, and smooth amber-musk drydown.",
        notes: "Blue Woody Amber",
        topNotes: "Bergamot Grapefruit, Storm Watch, Egomaniacal Green",
        middleNotes: "Mountain Spring, Rainforest Hibiscus, Dark Rose Oud",
        baseNotes: "Cedar & Aged Oak, Salted Amber, Ruby Red, Aurora Dawn",
        imageUrl: "/assets/file_00000000a484720ca189ff9971c50b75_1764982101085.png",
        bibleVerse: "Out came another horse, bright red. Its rider was permitted to take peace from the earth",
        verseReference: "Revelation 6:3–4",
      },
      {
        name: "FAMES",
        description: "Sweet, airy amber with crystalline warmth and an addictive modern trail.",
        notes: "Amber Sweet Airy",
        topNotes: "Sea Salt & Orchid, Birch Tree & Fig, Cashmere Plum",
        middleNotes: "Ruby Red, Cedar & Aged Oak, French Vanilla",
        baseNotes: "Salted Amber, Aurora Dawn",
        imageUrl: "/assets/file_00000000bfb0720cb4f9047931f5738d_1764984215951.png",
        bibleVerse: "I looked, and behold, a black horse! And its rider had a pair of scales in his hand",
        verseReference: "Revelation 6:5–6",
      },
      {
        name: "MORTEM",
        description: "Dense rose-oud body with a leathery incense middle and smoky amber finish.",
        notes: "Dark Oud Rose Resin",
        topNotes: "Smoked Cardamom, Midsummer Night",
        middleNotes: "Dark Rose Oud, Suede & Sumac Leaves, Cedar & Aged Oak",
        baseNotes: "Barnwood, Salted Amber, Boot Strap & Whiskey",
        imageUrl: "/assets/file_000000007fcc720cb4eb90ab90afb7c3_1764984190338.png",
        bibleVerse: "I looked, and behold, a pale horse! And its rider's name was Death",
        verseReference: "Revelation 6:7–8",
      },
      {
        name: "VOX CAELI",
        description: "Sparkling neroli-citrus top, marine-floral heart, and sheer amberwood base.",
        notes: "Neroli Marine Citrus",
        topNotes: "Italian Neroli, Bergamot Grapefruit, Fresh Juniper & Sea",
        middleNotes: "White Tea & Ginger, Sea Salt & Orchid, Rainforest Hibiscus, Mountain Spring",
        baseNotes: "Cedar & Aged Oak, Salted Amber",
        imageUrl: "/assets/file_00000000909471fd97064b4e9d17083f_1764984976100.png",
        bibleVerse: "I saw under the altar the souls of those who had been slain for the word of God",
        verseReference: "Revelation 6:9–11",
      },
      {
        name: "TERRA TREMOR",
        description: "Tobacco-vanilla smoke with boozy sweetness and a smooth amber-musk trail.",
        notes: "Tobacco Vanilla Smoke",
        topNotes: "Smoked Cardamom, Boot Strap & Whiskey",
        middleNotes: "Tobacco Leaves & Hemp Twist, French Vanilla, Barnwood",
        baseNotes: "Cedar & Aged Oak, Salted Amber, Aurora Dawn",
        imageUrl: "/assets/generated_images/Terra_Tremor_luxury_bottle_27a4bc2e.png",
        bibleVerse: "There was a great earthquake, and the sun became black as sackcloth",
        verseReference: "Revelation 6:12–17",
      },
      {
        name: "SABBATUM",
        description: "Soft pear-floral lift, tranquil clean tea heart, and musky amber serenity.",
        notes: "Pear Musk Fresh Comfort",
        topNotes: "English Pear & Freesia, Baja Cactus Blossom",
        middleNotes: "White Tea & Ginger, Sea Salt & Orchid",
        baseNotes: "Cedar & Aged Oak, Salted Amber, Aurora Dawn",
        imageUrl: "/assets/generated_images/Sabbatum_luxury_bottle_b96d831e.png",
        bibleVerse: "When the Lamb opened the seventh seal, there was silence in heaven for about half an hour",
        verseReference: "Revelation 8:1",
      },
      {
        name: "LUX AETERNA",
        description: "Crisp citrus-ozone opening with a green woody heart and glowing amber-musk finish.",
        notes: "Fresh Green Vetiver",
        topNotes: "Bergamot Grapefruit, Fresh Juniper & Sea, Alpine Cheer",
        middleNotes: "Egomaniacal Green, Birch Tree & Fig, Rainforest Hibiscus",
        baseNotes: "Cedar & Aged Oak, Barnwood, Salted Amber, Aurora Dawn",
        imageUrl: "/assets/generated_images/Lux_Aeterna_luxury_bottle_d2b6357e.png",
        bibleVerse: "The city has no need of sun or moon, for the glory of God gives it light",
        verseReference: "Revelation 21:23",
      }
    ];

    // Create the original RVLTN fragrances and their purchasable variants.
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
      // Pricing optimized using luxury fragrance industry best practices:
      // - Round numbers for premium positioning
      // - Smaller sizes have convenience premium (higher per-mL)
      // - Extrait 50-90% premium over EDP (industry standard)
      // - 100mL bottles positioned as best value (decoy pricing)
      const variants = [
        { size: "100mL", concentration: "Eau de Parfum", price: "120.00" },        // $1.20/mL - Best EDP value
        { size: "50mL", concentration: "Eau de Parfum", price: "65.00" },          // $1.30/mL - Entry point
        { size: "100mL", concentration: "Extrait de Parfum", price: "180.00" },    // $1.80/mL - Ultimate luxury
        { size: "50mL", concentration: "Extrait de Parfum", price: "95.00" },      // $1.90/mL - Premium tier
        { size: "10mL", concentration: "Pure Oil Roll-on", price: "28.00" },       // $2.80/mL - Luxury convenience
        { size: "30mL", concentration: "Pure Oil Roll-on", price: "60.00" },       // $2.00/mL - Better value
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

    for (const offer of chicagoOffers) {
      this.products.set(offer.productId, {
        id: offer.productId,
        name: offer.name,
        description: "A gaming-inspired Chicago Exclusif fragrance, offered as a 30 mL decant.",
        notes: "Gaming collection",
        topNotes: "",
        middleNotes: "",
        baseNotes: "",
        type: "Fragrance decant",
        imageUrl: offer.imageUrl,
        bibleVerse: "",
        verseReference: "",
        isActive: true,
        releaseDate: new Date(),
        createdAt: new Date(),
      });
      this.productVariants.set(offer.variantId, {
        id: offer.variantId,
        productId: offer.productId,
        sku: offer.sku,
        size: "30 mL",
        concentration: "Fragrance decant",
        price: "59.99",
        totalInventory: 25,
        remainingInventory: 25,
        soldCount: 0,
        isActive: true,
        createdAt: new Date(),
      });
    }
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
