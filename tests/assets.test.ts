import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import { products } from "../src/lib/catalog";
import { collections } from "../src/data/collections";
import { JOURNAL_ARTICLES } from "../src/lib/journal-data";
import { parseSiteUrl } from "../src/lib/site-config";
describe("catalog assets and content integrity", () => {
  it("validates the configured public origin without exposing credentials", () => {
    expect(parseSiteUrl(undefined)).toBe("https://morrow.example");
    expect(parseSiteUrl("http://localhost:3001/")).toBe("http://localhost:3001");
    for (const value of ["javascript:alert(1)", "https://user:pass@example.com", "https://example.com/path"]) expect(() => parseSiteUrl(value)).toThrow();
  });
  it("all catalog images exist and stay below the 2 MB per-image budget", () => {
    const paths = new Set(products.flatMap(p => p.colors.map(c => c.image)));
    for (const path of paths) {
      const file = resolve("public", path.slice(1));
      expect(existsSync(file), path).toBe(true);
      expect(statSync(file).size, path).toBeLessThan(2 * 1024 * 1024);
    }
  });
  it("every collection resolves to products and unique URLs", () => {
    expect(new Set(collections.map(c => c.slug)).size).toBe(collections.length);
    for (const collection of collections) expect(products.some(p => collection.categories.includes(p.category))).toBe(true);
  });
  it("editorial uses real catalog references and clearly labeled sample authors", () => {
    expect(JOURNAL_ARTICLES.length).toBeGreaterThanOrEqual(6);
    for (const article of JOURNAL_ARTICLES) {
      expect(article.authorRole).toContain("Sample");
      expect(article.relatedProductSlugs.every(slug => products.some(p => p.slug === slug))).toBe(true);
      expect(existsSync(resolve("public", article.heroImage.slice(1)))).toBe(true);
    }
  });
});
