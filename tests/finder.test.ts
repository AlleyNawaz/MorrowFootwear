import { describe, it, expect } from "vitest";
import { products } from "../src/lib/catalog";
import { finderSchema, rankShoes } from "../src/lib/finder";
describe("honest finder recommendations", () => {
  it("uses surface and maximum structure rather than ignoring them", () => {
    const results = rankShoes(products, { support: "Maximum", surface: "indoor" });
    for (const r of results) expect([...r.matches, ...r.tradeoffs].sort()).toEqual(["Maximum structure", "indoor surface"].sort());
  });
  it("ranks requested activity and reports mismatches", () => {
    const results = rankShoes(products, { activity: "Running", cushioning: "Soft", support: "Maximum", surface: "road" });
    expect(results[0].product.category).toBe("Running");
    expect(results[0].matches.length + results[0].tradeoffs.length).toBe(4);
  });
  it("excludes unavailable sample products and handles all skipped answers", () => {
    const results = rankShoes(products, {});
    expect(results).toHaveLength(3);
    expect(results.every(r => r.score === 0 && r.matches.length === 0)).toBe(true);
    expect(results.every(r => r.product.variants.some(v => ["in_stock", "low_stock"].includes(v.inventory.kind)))).toBe(true);
  });
  it("rejects unrecognized shared answers", () => {
    expect(finderSchema.safeParse({ surface: "unknown" }).success).toBe(false);
    expect(rankShoes([], {})).toEqual([]);
  });
});
