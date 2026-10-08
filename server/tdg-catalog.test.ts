import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { tdgOffers, tdgSizes, tdgVariants } from "../shared/tdg";
import { dreamerOffers, dreamerVariants } from "../shared/dreamer";
import { chicagoOffers, countChicagoSets, isChicagoVariant } from "../shared/chicago";
import { shippingCentsForSubtotal } from "../shared/commerce";
import { decantPrice, decantPricePerMl } from "../shared/decant-pricing";
import { storage } from "./storage";
import { priceCart } from "./payments";

test("TDG has all 25 inspirations, five graduated-price sizes each, and real local reference images", async () => {
  assert.equal(tdgOffers.length, 25);
  assert.equal(tdgVariants.length, 125);
  assert.equal(new Set(tdgVariants.map(v => v.id)).size, 125);
  for (const offer of tdgOffers) {
    assert.notEqual(offer.name.toLowerCase(), offer.original.toLowerCase());
    assert.ok(existsSync(`client/public${offer.imageUrl}`), `Missing image for ${offer.original}`);
    const product = await storage.getProduct(offer.productId);
    assert.equal(product?.isActive, true);
    const variants = await storage.getProductVariants(offer.productId);
    assert.equal(variants.length, 5);
    for (const [index, size] of tdgSizes.entries()) {
      assert.equal(variants[index].size, `${size} mL`);
      assert.equal(variants[index].price, decantPrice(size));
      const legacySlot = ({ 5: 0, 10: 1, 20: 2, 30: 3 } as Record<number, number>)[size];
      if (legacySlot !== undefined) {
        const oldId = `70ac0000-0000-4000-8000-${String(1000 + Number(offer.code) * 10 + legacySlot).padStart(12, "0")}`;
        assert.equal(variants[index].id, oldId, `Existing ${size} mL variant ID must remain stable`);
      }
      assert.equal(variants[index].remainingInventory, 50);
      assert.equal(variants[index].totalInventory, 50);
      assert.equal(isChicagoVariant(variants[index].id), true);
    }
  }
  assert.deepEqual(tdgSizes.map(decantPrice), ["7.50", "12.00", "16.50", "20.00", "27.00"]);
  assert.deepEqual(tdgSizes.map(decantPricePerMl), ["1.50", "1.20", "1.10", "1.00", "0.90"]);
});

test("Dreamer and Gaming remain active; Seven Seals is archived rather than deleted", async () => {
  const products = await storage.getAllProducts();
  assert.equal(products.filter(p => p.isActive).length, 31);
  assert.equal(products.filter(p => !p.isActive).length, 8);
  for (const offer of [...dreamerOffers, ...chicagoOffers])
    assert.equal((await storage.getProduct(offer.productId))?.isActive, true);
  for (const variant of dreamerVariants) {
    assert.equal(isChicagoVariant(variant.id), true);
    assert.equal((await storage.getProductVariant(variant.id))?.remainingInventory, 50);
    assert.equal(variant.price, decantPrice(Number.parseInt(variant.size, 10)));
  }
  assert.equal(dreamerVariants.length, 15);
  for (const offer of chicagoOffers) {
    const variant = await storage.getProductVariant(offer.variantId);
    assert.equal(variant?.price, "59.99");
    assert.equal(variant?.remainingInventory, 25);
  }
});

test("free shipping is strictly over $50, not at $50", () => {
  assert.equal(shippingCentsForSubtotal(4999), 899);
  assert.equal(shippingCentsForSubtotal(5000), 899);
  assert.equal(shippingCentsForSubtotal(5001), 0);
});

test("server prices TDG carts and shipping; clients cannot supply a price", async () => {
  const five = tdgVariants[0].id;
  const fifteen = tdgVariants[2].id;
  const thirty = tdgVariants[4].id;
  assert.equal(await priceCart([{ variantId: five, quantity: 1 }], undefined, new Map()), 1649);
  assert.equal(await priceCart([{ variantId: fifteen, quantity: 1 }], undefined, new Map()), 2549);
  assert.equal(await priceCart([{ variantId: thirty, quantity: 1 }], undefined, new Map()), 3599);
  const mixed = [{ variantId: thirty, quantity: 1 }, { variantId: five, quantity: 1 }];
  assert.equal(await priceCart(mixed, undefined, new Map()), 4349);
  assert.equal(await priceCart(mixed, "WELCOME10", new Map()), 4004);
  assert.equal(countChicagoSets(mixed), 0);
  const gaming = chicagoOffers.map(offer => ({ variantId: offer.variantId, quantity: 1 }));
  assert.equal(await priceCart(gaming, undefined, new Map()), 15000);
  assert.equal(countChicagoSets([...gaming, ...mixed]), 1);
});

test("TDG pricing rejects stock already held or sold and archived offers", async () => {
  const id = tdgVariants[0].id;
  const unavailable = new Map([[id, 49]]);
  await assert.rejects(priceCart([{ variantId: id, quantity: 2 }], undefined, unavailable), /inventory/i);
  assert.equal(await priceCart([{ variantId: id, quantity: 1 }], undefined, unavailable), 1649);
  await assert.rejects(priceCart([{ variantId: id, quantity: 51 }], undefined, new Map()), /inventory/i);
  const archived = (await storage.getAllProductVariants()).find(v => !v.isActive)!;
  await assert.rejects(priceCart([{ variantId: archived.id, quantity: 1 }], undefined, new Map()), /no longer available/i);
});
