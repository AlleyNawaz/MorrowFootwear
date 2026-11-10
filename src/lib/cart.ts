import type { CartLine, Product } from "./types";
import { z } from "zod";
const storedLineSchema = z.object({
  productId: z.string(),
  color: z.string(),
  size: z.string(),
  width: z.string(),
  quantity: z.number().int().positive(),
});

export const MAX_LINE_QUANTITY = 10;
export function cartLineKey(
  line: Pick<CartLine, "productId" | "variantId" | "color" | "size" | "width">,
): string {
  return JSON.stringify([
    line.productId,
    line.variantId,
    line.color,
    line.size,
    line.width,
  ]);
}
export function quantityLimit(product: Product, variantId: string): number {
  const inventory = product.variants.find((v) => v.id === variantId)?.inventory;
  if (!inventory || !["in_stock", "low_stock"].includes(inventory.kind))
    return 0;
  return "quantityAvailable" in inventory
    ? Math.min(
        MAX_LINE_QUANTITY,
        inventory.quantityAvailable ?? MAX_LINE_QUANTITY,
      )
    : MAX_LINE_QUANTITY;
}
export function readCart(value: unknown, catalog: Product[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  const valid: CartLine[] = [];
  for (const raw of value.slice(0, 100)) {
    const result = storedLineSchema.safeParse(raw);
    if (!result.success) continue;
    const candidate = result.data;
    const product = catalog.find((p) => p.id === candidate.productId);
    const variant = product?.variants.find((v) => v.color === candidate.color);
    if (
      !product ||
      !variant ||
      !variant.sizes.includes(candidate.size) ||
      !variant.widths.includes(candidate.width) ||
      !Number.isInteger(candidate.quantity) ||
      candidate.quantity < 1
    )
      continue;
    const limit = quantityLimit(product, variant.id);
    if (!limit) continue;
    const line: CartLine = {
      productId: product.id,
      variantId: variant.id,
      color: variant.color,
      size: candidate.size,
      width: candidate.width,
      quantity: Math.min(limit, candidate.quantity),
    };
    const existing = valid.find((l) => cartLineKey(l) === cartLineKey(line));
    if (existing)
      existing.quantity = Math.min(limit, existing.quantity + line.quantity);
    else valid.push(line);
  }
  return valid;
}
export function removeCartLine(
  lines: CartLine[],
  target: CartLine,
): CartLine[] {
  return lines.filter((line) => cartLineKey(line) !== cartLineKey(target));
}
export function updateCartQuantity(
  lines: CartLine[],
  target: CartLine,
  quantity: number,
  catalog: Product[],
): CartLine[] {
  if (!Number.isInteger(quantity)) return lines;
  return readCart(
    lines.flatMap((line) =>
      cartLineKey(line) !== cartLineKey(target)
        ? [line]
        : quantity <= 0
          ? []
          : [{ ...line, quantity }],
    ),
    catalog,
  );
}
export function readStringList(value: unknown, allowed?: string[]): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (v): v is string =>
              typeof v === "string" &&
              v.length < 100 &&
              (!allowed || allowed.includes(v)),
          ),
        ),
      ].slice(0, 20)
    : [];
}
export function safeJson(value: string | null): unknown {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}
