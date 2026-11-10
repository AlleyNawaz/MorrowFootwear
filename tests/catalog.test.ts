import { describe, it, expect } from "vitest";
import { products, findProduct, getProductsByCategory, formatMoney } from "../src/lib/catalog";

describe("Footwear Catalog", () => {
  it("contains exactly 12 rich footwear models", () => {
    expect(products.length).toBe(12);
  });

  it("every product has unique slug and id", () => {
    const slugs = products.map((p) => p.slug);
    const ids = products.map((p) => p.id);
    expect(new Set(slugs).size).toBe(12);
    expect(new Set(ids).size).toBe(12);
  });

  it("findProduct finds product by slug", () => {
    const p = findProduct("daybreak-one");
    expect(p).toBeDefined();
    expect(p?.name).toBe("Daybreak One");
    expect(p?.price.amount).toBe(14800);
  });

  it("formats minor units to USD currency correctly", () => {
    expect(formatMoney({ amount: 14800, currency: "USD" })).toBe("$148.00");
    expect(formatMoney({ amount: 6800, currency: "USD" })).toBe("$68.00");
    expect(formatMoney({ amount: 10550, currency: "USD" })).toBe("$105.50");
  });

  it("filters products by category properly", () => {
    const running = getProductsByCategory("Running");
    expect(running.length).toBeGreaterThan(0);
    expect(running[0].slug).toBe("daybreak-one");
  });

  it("every product has at least one colorway and variant with sizes", () => {
    for (const product of products) {
      expect(product.colors.length).toBeGreaterThan(0);
      expect(product.variants.length).toBeGreaterThan(0);
      expect(product.variants[0].sizes.length).toBeGreaterThan(0);
      expect(product.variants[0].widths.length).toBeGreaterThan(0);
      expect(product.features.length).toBeGreaterThan(0);
      expect(product.materials.length).toBeGreaterThan(0);
    }
  });
});
