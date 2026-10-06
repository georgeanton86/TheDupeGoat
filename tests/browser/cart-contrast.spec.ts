import { test, expect } from "./fixtures";

for (const surface of ["sidebar", "desktop header", "mobile header", "mobile floating"]) {
  test(`${surface}: populated cart text meets AA contrast`, async ({ page, stock }, testInfo) => {
    await page.setViewportSize(surface.startsWith("mobile")
      ? { width: 390, height: 844 } : { width: 1440, height: 1000 });
    await page.goto("/shop");
    await page.getByTestId("button-add-chicago-set").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    if (surface === "sidebar" || surface === "mobile floating") {
      await page.keyboard.press("Escape");
      if (surface === "mobile floating") await page.getByTestId("button-mobile-cart").click();
    }
    const cart = surface === "sidebar" ? page.locator(".sticky.top-24") : page.getByRole("dialog");
    await cart.getByPlaceholder("Promo code").fill("WELCOME10");
    await cart.getByRole("button", { name: "Apply", exact: true }).click();
    await expect(cart.getByText("10% discount applied.")).toBeVisible();
    await expect(cart.getByText("Gaming set savings × 1:")).toBeVisible();
    await expect(cart.getByText(/Gaming concept imagery/)).toBeVisible();
    const contrasts = await cart.locator("p, span, h3").evaluateAll(nodes => {
      const rgb = (value: string) => value.match(/[\d.]+/g)!.map(Number);
      const luminance = (values: number[]) => values.slice(0, 3).map(n => {
        const s = n / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0);
      return nodes.filter(node => node.textContent?.trim() && !node.children.length &&
        !node.closest("button") && node.getBoundingClientRect().width > 0).map(node => {
        let ancestor: Element | null = node;
        let background = [0, 0, 0, 0];
        while (ancestor && background[3] === 0) {
          background = rgb(getComputedStyle(ancestor).backgroundColor);
          ancestor = ancestor.parentElement;
        }
        const fg = luminance(rgb(getComputedStyle(node).color));
        const bg = luminance(background);
        return { text: node.textContent, ratio: (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) };
      });
    });
    expect(contrasts.length).toBeGreaterThan(10);
    for (const item of contrasts) expect(item.ratio, item.text!).toBeGreaterThanOrEqual(4.5);
    await cart.screenshot({ path: testInfo.outputPath("populated-cart.png") });
    expect(stock.paymentRequests).toEqual([]);
  });
}
