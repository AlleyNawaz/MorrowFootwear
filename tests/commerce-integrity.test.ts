import { describe, it, expect } from "vitest";
import { products } from "../src/lib/catalog";
import { cartLineKey, readCart, safeJson } from "../src/lib/cart";
import { searchProducts } from "../src/lib/search";
import { addressSchema, parseOrders } from "../src/lib/demo-orders";
import { validateCoupon } from "../src/lib/promotions";
const product = products[0];
const line = {
  productId: product.id,
  variantId: product.variants[0].id,
  color: product.colors[0].name,
  size: "7",
  width: "Standard",
  quantity: 1,
};
describe("commerce integrity", () => {
  it("rejects malformed storage", () => {
    expect(readCart({ lines: [] }, products)).toEqual([]);
    expect(readCart([null, {}, { ...line, quantity: -1 }], products)).toEqual(
      [],
    );
    expect(safeJson("{")).toBeNull();
  });
  it("keeps widths and colors separate", () => {
    const lines = readCart(
      [line, { ...line, width: "Wide" }, { ...line, color: "Bone" }],
      products,
    );
    expect(lines).toHaveLength(3);
    expect(new Set(lines.map(cartLineKey)).size).toBe(3);
  });
  it("migrates valid old color selections to their actual variant", () => {
    const [parsed] = readCart([{ ...line, color: "Bone" }], products);
    expect(parsed.variantId).not.toBe(line.variantId);
  });
  it("merges exact duplicates and caps quantities", () => {
    expect(
      readCart([line, { ...line, quantity: 1000 }], products)[0].quantity,
    ).toBe(10);
  });
  it("rejects unavailable variants and bad sizes", () => {
    expect(readCart([{ ...line, size: "999" }], products)).toEqual([]);
  });
  it("all sample colorways have matching variants", () => {
    for (const p of products)
      expect(p.variants.map((v) => v.color)).toEqual(
        p.colors.map((c) => c.name),
      );
  });
  it("search tolerates typos and aliases", () => {
    expect(searchProducts(products, "daybrek")[0].id).toBe(product.id);
    expect(searchProducts(products, "gym")[0].category).toBe("Training");
    expect(searchProducts(products, "zzzzzz")).toEqual([]);
  });
  it("validates address and saved orders", () => {
    expect(addressSchema.safeParse({ email: "bad" }).success).toBe(false);
    expect(parseOrders("[{}]")).toEqual([]);
  });
  it("rejects prototype property promotion names", () => {
    expect(validateCoupon("constructor", 20000).valid).toBe(false);
    expect(validateCoupon("__proto__", 20000).valid).toBe(false);
  });
});
