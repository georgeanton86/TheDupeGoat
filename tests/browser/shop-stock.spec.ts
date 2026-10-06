import { test, expect, offers } from "./fixtures";

test("repeated individual additions stop at the remaining stock", async ({ page, stock }) => {
  stock.publicStock = [2, 3, 3];
  await page.goto("/shop");
  const add = page.getByTestId(`button-add-to-cart-${offers[0].productId}`);
  await add.click();
  await add.click();
  await expect(add).toBeDisabled();
  await expect(page.getByTestId(`select-quantity-${offers[0].productId}`)).toBeDisabled();
  await page.getByRole("button", { name: "Open cart, 2 items" }).click();
  await expect(page.getByRole("dialog").getByRole("combobox")).toHaveText("2");
  expect(stock.paymentRequests).toEqual([]);
});

test("sets and individual additions share the same inventory limit", async ({ page, stock }) => {
  stock.publicStock = [2, 3, 3];
  await page.goto("/shop");
  await page.getByTestId(`button-add-to-cart-${offers[0].productId}`).click();
  await page.getByTestId("button-add-chicago-set").click();
  await expect(page.getByTestId("button-add-chicago-set")).toBeDisabled();
  await expect(page.getByTestId(`button-add-to-cart-${offers[0].productId}`)).toBeDisabled();
  await expect(page.getByRole("dialog").getByRole("combobox")).toHaveText(["2", "1", "1"]);
  expect(stock.paymentRequests).toEqual([]);
});

for (const surface of ["sidebar", "header drawer", "mobile drawer"] as const) {
  test(`${surface} quantity selector caps stock and zero removes the line`, async ({ page, stock }) => {
    stock.publicStock = [2, 3, 3];
    await page.setViewportSize(surface === "mobile drawer" ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.goto("/shop");
    await page.getByTestId(`button-add-to-cart-${offers[0].productId}`).click();
    if (surface === "header drawer") await page.getByRole("button", { name: "Open cart, 1 items" }).click();
    if (surface === "mobile drawer") await page.getByTestId("button-mobile-cart").click();
    const selector = surface === "sidebar"
      ? page.locator(".sticky.top-24").getByRole("combobox")
      : page.getByRole("dialog").getByRole("combobox");
    await selector.click();
    await expect(page.getByRole("option")).toHaveText(["Remove", "1", "2"]);
    await page.getByRole("option", { name: "2", exact: true }).click();
    await expect(selector).toHaveText("2");
    await selector.click();
    await page.getByRole("option", { name: "Remove", exact: true }).click();
    await expect(page.getByText("Your cart is empty", { exact: true }).last()).toBeVisible();
    expect(stock.paymentRequests).toEqual([]);
  });
}

test("Proceed refreshes reduced stock, stays in shop for review, then saves corrected quantities", async ({ page, stock }) => {
  await page.goto("/shop");
  const add = page.getByTestId(`button-add-to-cart-${offers[0].productId}`);
  await add.click();
  await add.click();
  stock.publicStock = [1, 3, 3];
  await page.getByTestId("button-checkout").click();
  await expect(page.getByRole("dialog").getByRole("combobox")).toHaveText("1");
  await expect(page).toHaveURL(/\/shop$/);
  expect(await page.evaluate(() => localStorage.getItem("checkoutCart"))).toBeNull();
  expect(stock.paymentRequests).toEqual([]);
  await page.getByRole("dialog").getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("checkoutCart")!));
  expect(saved.cart).toEqual([{ variantId: offers[0].variantId, quantity: 1 }]);
  expect(saved.checkoutKey).toBeTruthy();
});
