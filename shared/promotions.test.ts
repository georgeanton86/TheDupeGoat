import { strict as assert } from "node:assert";
import { test } from "node:test";
import { cartPricing, parsePromoCodes } from "./promotions";

test("retired trial codes are rejected alone and in combinations", () => {
  for (const code of ["99OFF", "freeship", " freeship + 99off, FREESHIP ", "WELCOME10 FREESHIP", "99OFF WELCOME10"]) {
    assert.throws(() => parsePromoCodes(code), /invalid or no longer available/);
    assert.throws(() => cartPricing(5999, 0, code), /invalid or no longer available/);
  }
});

test("remaining code is case insensitive and deduplicated; set savings remain", () => {
  assert.deepEqual(parsePromoCodes(" welcome10 + WELCOME10 "), ["WELCOME10"]);
  assert.equal(cartPricing(17997, 2997).totalCents, 15000);
  assert.equal(cartPricing(17997, 2997, "WELCOME10").totalCents, 13500);
});

test("welcome discount and strict shipping threshold remain unchanged", () => {
  assert.equal(cartPricing(5000, 0).shippingCents, 899);
  assert.equal(cartPricing(5001, 0).shippingCents, 0);
  assert.equal(cartPricing(750, 0, "WELCOME10").totalCents, 1574);
});

test("unknown promos fail explicitly", () => {
  assert.throws(() => parsePromoCodes("80OFF"), /invalid/);
  assert.throws(() => cartPricing(5999, 0, "NOPE"), /invalid/);
});
