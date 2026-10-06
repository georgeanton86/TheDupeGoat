type InventoryVariant = { id: string; isActive: boolean; remainingInventory: number };
type CartLine = { variantId: string; quantity: number };

export function inventoryLimit(variant: InventoryVariant | undefined): number {
  if (!variant?.isActive || !Number.isFinite(variant.remainingInventory)) return 0;
  return Math.min(100, Math.max(0, Math.floor(variant.remainingInventory)));
}

export function reconcileCart<T extends CartLine>(lines: T[], variants: InventoryVariant[]): T[] {
  const byId = new Map(variants.map(variant => [variant.id, variant]));
  return lines.flatMap(line => {
    const quantity = Math.min(line.quantity, inventoryLimit(byId.get(line.variantId)));
    return Number.isInteger(quantity) && quantity > 0 ? [{ ...line, quantity }] : [];
  });
}

export function cartMatchesInventory(lines: CartLine[], variants: InventoryVariant[]): boolean {
  const next = reconcileCart(lines, variants);
  return next.length === lines.length && next.every((line, index) => line.quantity === lines[index].quantity);
}

export function canAddCartLines(current: CartLine[], additions: CartLine[], variants: InventoryVariant[]): boolean {
  const byId = new Map(variants.map(variant => [variant.id, variant]));
  const quantities = new Map<string, number>();
  for (const line of [...current, ...additions]) {
    if (!Number.isInteger(line.quantity) || line.quantity <= 0) return false;
    quantities.set(line.variantId, (quantities.get(line.variantId) ?? 0) + line.quantity);
  }
  return Array.from(quantities).every(([id, quantity]) => quantity <= inventoryLimit(byId.get(id)));
}
