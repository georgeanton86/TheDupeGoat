import { strict as assert } from "node:assert";
import { test } from "node:test";
import { cartPricing, parsePromoCodes, minimumCardChargeCents } from "./promotions";

test("temporary codes are case insensitive, composable and deduplicated", () => {
  assert.deepEqual(parsePromoCodes(" freeship + 99off, FREESHIP "), ["FREESHIP", "99OFF"]);
  const result = cartPricing(750, 0, "FREESHIP");
  assert.equal(result.totalCents, 750);
  assert.equal(result.shippingCents, 0);
  assert.equal(cartPricing(750, 0, "99off").totalCents, 906);
});

test("99% discount and shipping waiver produce exact integer cent totals", () => {
  assert.equal(cartPricing(5999, 0, "99off freeship").totalCents, 60);
  assert.equal(cartPricing(750, 0, "99off freeship").totalCents, 7);
  assert.ok(cartPricing(750, 0, "99off freeship").totalCents < minimumCardChargeCents);
  assert.equal(cartPricing(17997, 2997, "99OFF FREESHIP").totalCents, 150);
});

test("welcome discount and strict shipping threshold remain unchanged", () => {
  assert.equal(cartPricing(5000, 0).shippingCents, 899);
  assert.equal(cartPricing(5001, 0).shippingCents, 0);
  assert.equal(cartPricing(750, 0, "WELCOME10").totalCents, 1574);
  assert.equal(cartPricing(750, 0, "WELCOME10 FREESHIP").totalCents, 675);
});

test("unknown and competing percentage promos fail explicitly", () => {
  assert.throws(() => parsePromoCodes("80OFF"), /invalid/);
  assert.throws(() => parsePromoCodes("99OFF WELCOME10"), /only one/);
  assert.throws(() => cartPricing(5999, 0, "NOPE"), /invalid/);
});
