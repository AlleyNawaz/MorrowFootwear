import { describe, it, expect } from "vitest";
import { products } from "../src/lib/catalog";
import { readCart, removeCartLine, updateCartQuantity } from "../src/lib/cart";
const product = products[0],
  variant = product.variants[0];
const item = {
  productId: product.id,
  variantId: variant.id,
  color: variant.color,
  size: variant.sizes[0],
  width: variant.widths[0],
  quantity: 1,
};
describe("production cart transformations", () => {
  it("merges identical selections", () =>
    expect(readCart([item, item], products)[0].quantity).toBe(2));
  it("edits one width without changing another", () => {
    const wide = { ...item, width: "Wide" };
    const result = updateCartQuantity([item, wide], item, 3, products);
    expect(result.map((l) => l.quantity)).toEqual([3, 1]);
  });
  it("removes only the requested line", () => {
    const wide = { ...item, width: "Wide" };
    expect(removeCartLine([item, wide], item)).toEqual([wide]);
    expect(updateCartQuantity([item], item, 0, products)).toEqual([]);
  });
});
