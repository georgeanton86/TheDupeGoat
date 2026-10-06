import { test, expect, seedCheckout, fillBuyer, expectBuyer, buyer, offers, checkoutKey } from "./fixtures";

test("loaded shortage requires explicit adjustment before payment", async ({ page, stock }) => {
  stock.availability = [1, 0, 3];
  await seedCheckout(page, [2, 1, 0]);
  await fillBuyer(page);
  const pay = page.getByRole("button", { name: "Continue to payment" });
  await expect(pay).toBeDisabled();
  expect(stock.paymentRequests).toEqual([]);
  await page.getByRole("button", { name: "Update cart to available stock" }).click();
  await expect(page.getByText(/PLAYER ONE .* × 1/)).toBeVisible();
  await expect(page.getByText(/PLAY AGAIN\? .* ×/)).toHaveCount(0);
  await expectBuyer(page);
  await pay.click();
  await expect(page.getByRole("alert")).toContainText("Payments are unavailable");
  expect(stock.paymentRequests[0].items).toEqual([{ variantId: offers[0].variantId, quantity: 1 }]);
});

test("stock drops during submission: adjust, preserve details, and require another click", async ({ page, stock }) => {
  await seedCheckout(page, [2, 0, 0]);
  await fillBuyer(page);
  stock.availability = [1, 3, 3];
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByRole("alert")).toContainText("Review your order");
  expect(stock.paymentRequests).toEqual([]);
  await expectBuyer(page);
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByRole("alert")).toContainText("Payments are unavailable");
  expect(stock.paymentRequests).toHaveLength(1);
  expect(stock.paymentRequests[0]).toMatchObject({
    ...buyer, checkoutKey, policyAcknowledged: true, decantAcknowledged: true,
    items: [{ variantId: offers[0].variantId, quantity: 1 }],
  });
  expect(stock.events.slice(-2)).toEqual(["availability", "payment"]);
});

test("failed availability preserves buyer details through retry and reload", async ({ page, stock }) => {
  await seedCheckout(page);
  await fillBuyer(page);
  stock.failAvailability = true;
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByRole("alert")).toContainText("Could not check stock");
  await expectBuyer(page);
  expect(stock.paymentRequests).toEqual([]);
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("Your checkout details are unchanged");
  stock.failAvailability = false;
  await page.getByRole("button", { name: "Retry stock check" }).click();
  await expectBuyer(page);
  await page.getByRole("button", { name: "Continue to payment" }).click();
  await expect(page.getByRole("alert")).toContainText("Payments are unavailable");
  expect(stock.paymentRequests).toHaveLength(1);
  expect(stock.paymentRequests[0]).toMatchObject({ ...buyer, checkoutKey });
});

test("retry and reload use the same unexpired hold when public stock is zero", async ({ page, stock }) => {
  stock.publicStock = [0, 3, 3];
  stock.availability = [0, 3, 3];
  stock.hold = { key: checkoutKey, quantities: [1, 0, 0], expiresAt: Date.now() + 600_000 };
  await seedCheckout(page);
  await fillBuyer(page);
  for (let attempt = 0; attempt < 2; attempt++) {
    await page.getByRole("button", { name: "Continue to payment" }).click();
    await expect(page.getByRole("alert")).toContainText("Payments are unavailable");
    await expectBuyer(page);
    if (attempt === 0) await page.reload();
  }
  expect(stock.paymentRequests).toHaveLength(2);
  expect(stock.paymentRequests[0]).toEqual(stock.paymentRequests[1]);
  expect(stock.availabilityKeys.length).toBeGreaterThanOrEqual(4);
  expect(new Set(stock.availabilityKeys)).toEqual(new Set([checkoutKey]));
  expect(stock.paymentRequests[0].items).toEqual([{ variantId: offers[0].variantId, quantity: 1 }]);
});
