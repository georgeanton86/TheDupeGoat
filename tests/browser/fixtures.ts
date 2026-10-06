import { test as base, expect, type Page } from "@playwright/test";
import { chicagoOffers } from "../../shared/chicago";

export const offers = chicagoOffers;
export const checkoutKey = "browser-stock-attempt";
export const products = offers.map(offer => ({
  id: offer.productId, name: offer.name, description: "Browser fixture fragrance",
  notes: "Citrus", topNotes: "Citrus", middleNotes: "Wood", baseNotes: "Musk",
  type: "unisex", imageUrl: "", bibleVerse: "", verseReference: "",
  isActive: true, releaseDate: "2025-01-01", createdAt: "2025-01-01",
}));
const inventory = (counts: number[]) => offers.map((offer, i) => ({
  id: offer.variantId, productId: offer.productId, sku: offer.sku,
  size: "30ml", concentration: "Extrait", price: "59.99",
  totalInventory: 10, remainingInventory: counts[i], soldCount: 0,
  isActive: true, createdAt: "2025-01-01",
}));

export type PaymentRequest = {
  checkoutKey: string;
  items: { variantId: string; quantity: number }[];
  customerName: string; customerEmail: string;
  address: Record<string, string>;
  policyAcknowledged: boolean; decantAcknowledged: boolean;
};
type StockFixture = {
  publicStock: number[];
  availability: number[];
  failAvailability: boolean;
  failPublic: boolean;
  paymentRequests: PaymentRequest[];
  availabilityKeys: string[];
  events: string[];
  hold: { key: string; quantities: number[]; expiresAt: number } | null;
};

export const test = base.extend<{ stock: StockFixture }>({
  stock: async ({ context }, use) => {
    const stock: StockFixture = {
      publicStock: [3, 3, 3], availability: [3, 3, 3],
      failAvailability: false, failPublic: false,
      paymentRequests: [], availabilityKeys: [], events: [], hold: null,
    };
    const unexpected: string[] = [];
    await context.route("**/*", async route => {
      const request = route.request();
      const url = new URL(request.url());
      // Deny all external traffic, including Stripe.js, Stripe API and analytics.
      if (url.origin !== "http://127.0.0.1:5174") return route.abort();
      const json = (body: unknown, status = 200) => route.fulfill({ status, json: body });
      if (!url.pathname.startsWith("/api/")) return route.continue();
      if (url.pathname === "/api/products") return json(products);
      if (url.pathname === "/api/product-variants") {
        stock.events.push("public");
        return json(inventory(stock.publicStock), stock.failPublic ? 503 : 200);
      }
      if (url.pathname.startsWith("/api/checkout-availability/")) {
        const key = decodeURIComponent(url.pathname.split("/").pop()!);
        stock.availabilityKeys.push(key);
        stock.events.push("availability");
        const ownHold = stock.hold?.key === key && stock.hold.expiresAt > Date.now();
        const counts = stock.availability.map((n, i) => n + (ownHold ? stock.hold!.quantities[i] : 0));
        return json(inventory(counts), stock.failAvailability ? 503 : 200);
      }
      if (url.pathname === "/api/create-payment-intent" && request.method() === "POST") {
        stock.events.push("payment");
        stock.paymentRequests.push(request.postDataJSON());
        return json({ clientSecret: "pi_fixture_secret_fixture", total: 59.99 });
      }
      // Stop after payment preparation, before initializing any payment SDK.
      if (url.pathname === "/api/stripe/config") return json({ message: "Fixture payment boundary" }, 503);
      unexpected.push(`${request.method()} ${url.pathname}`);
      return json({ message: "Unmocked API request" }, 500);
    });
    await use(stock);
    expect(unexpected, "Every API call must be explicitly mocked").toEqual([]);
  },
});
export { expect };

export async function seedCheckout(page: Page, quantities = [1, 0, 0]) {
  await page.goto("/shop");
  await page.evaluate(({ key, cart }) => {
    localStorage.setItem("checkoutCart", JSON.stringify({ checkoutKey: key, cart, promoCode: null }));
  }, { key: checkoutKey, cart: offers.flatMap((offer, i) =>
    quantities[i] ? [{ variantId: offer.variantId, quantity: quantities[i] }] : []) });
  await page.goto("/checkout");
}

export const buyer = {
  customerName: "Browser Test", customerEmail: "browser@example.test",
  address: { line1: "100 Test Street", line2: "Suite 2", city: "Chicago", state: "IL", postal_code: "60601", country: "US" },
};
export async function fillBuyer(page: Page) {
  await page.getByLabel("Full name").fill(buyer.customerName);
  await page.getByLabel("Email", { exact: true }).fill(buyer.customerEmail);
  for (const [key, value] of Object.entries(buyer.address)) {
    if (key !== "country") await page.locator(`#${key}`).fill(value);
  }
  await page.locator("#policy").check();
  await page.locator("#decant").check();
}
export async function expectBuyer(page: Page) {
  await expect(page.getByLabel("Full name")).toHaveValue(buyer.customerName);
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(buyer.customerEmail);
  for (const [key, value] of Object.entries(buyer.address)) {
    if (key !== "country") await expect(page.locator(`#${key}`)).toHaveValue(value);
  }
  await expect(page.locator("#policy")).toBeChecked();
  await expect(page.locator("#decant")).toBeChecked();
}
