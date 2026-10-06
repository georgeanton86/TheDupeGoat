import assert from "node:assert/strict";
import { test } from "node:test";
import { canAddCartLines, cartMatchesInventory, inventoryLimit, reconcileCart } from "./cart-inventory";

const variants = [
  { id: "a", isActive: true, remainingInventory: 2 },
  { id: "b", isActive: true, remainingInventory: 1 },
  { id: "c", isActive: true, remainingInventory: 3 },
];

test("inventory limits fail closed for missing, inactive, sold-out and invalid stock", () => {
  assert.equal(inventoryLimit(undefined), 0);
  for (const remainingInventory of [0, -1, NaN, Infinity]) {
    assert.equal(inventoryLimit({ id: "a", isActive: true, remainingInventory }), 0);
  }
  assert.equal(inventoryLimit({ ...variants[0], isActive: false }), 0);
  assert.equal(inventoryLimit({ ...variants[0], remainingInventory: 150 }), 100);
});

test("repeated additions count quantities already in the cart", () => {
  const cart = [{ variantId: "a", quantity: 1 }];
  assert.equal(canAddCartLines(cart, [{ variantId: "a", quantity: 1 }], variants), true);
  assert.equal(canAddCartLines(cart, [{ variantId: "a", quantity: 2 }], variants), false);
  assert.equal(canAddCartLines([{ variantId: "a", quantity: 2 }], [{ variantId: "a", quantity: 1 }], variants), false);
});

test("a set is rejected as a whole when any fragrance is exhausted", () => {
  const set = variants.map(v => ({ variantId: v.id, quantity: 1 }));
  assert.equal(canAddCartLines([], set, variants), true);
  assert.equal(canAddCartLines([{ variantId: "b", quantity: 1 }], set, variants), false);
  assert.equal(canAddCartLines([], set, variants.map(v => ({ ...v, remainingInventory: v.id === "c" ? 0 : v.remainingInventory }))), false);
});

test("stock refresh trims quantities and removes sold-out and missing items", () => {
  const cart = [
    { variantId: "a", quantity: 5, name: "Preserved" },
    { variantId: "b", quantity: 1, name: "Sold out" },
    { variantId: "missing", quantity: 1, name: "Removed" },
  ];
  const available = variants.map(v => ({ ...v, remainingInventory: v.id === "b" ? 0 : v.remainingInventory }));
  assert.equal(cartMatchesInventory(cart, available), false);
  assert.deepEqual(reconcileCart(cart, available), [{ variantId: "a", quantity: 2, name: "Preserved" }]);
  assert.equal(cartMatchesInventory(reconcileCart(cart, available), available), true);
  assert.equal(cart[0].quantity, 5);
});

test("invalid and aggregated additions cannot bypass stock limits", () => {
  for (const quantity of [0, -1, 1.5, NaN, 101]) {
    assert.equal(canAddCartLines([], [{ variantId: "a", quantity }], variants), false);
  }
  assert.equal(canAddCartLines([], [{ variantId: "a", quantity: 2 }, { variantId: "a", quantity: 1 }], variants), false);
});
