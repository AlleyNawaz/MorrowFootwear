import type { Product } from "./types";
const synonyms: Record<string, string> = {
  sneeker: "lifestyle",
  sneakers: "lifestyle",
  sneaker: "lifestyle",
  jogging: "running",
  jog: "running",
  runners: "running",
  walkers: "walking",
  hike: "hiking",
  gym: "training",
  workout: "training",
  cushioned: "soft",
  cushion: "soft",
};
export function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const next = [i];
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(
        next[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    previous = next;
  }
  return previous[b.length];
}
export function searchProducts(catalog: Product[], query: string): Product[] {
  const terms = query
    .toLowerCase()
    .trim()
    .slice(0, 100)
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => synonyms[t] ?? t);
  if (!terms.length) return catalog.slice(0, 4);
  return catalog.filter((p) => {
    const words =
      `${p.name} ${p.category} ${p.styleCode} ${p.cushioning} ${p.support} ${p.colors.map((c) => c.name).join(" ")} ${p.terrain}`
        .toLowerCase()
        .split(/[^a-z0-9]+/);
    return terms.every((term) =>
      words.some(
        (word) =>
          word.includes(term) ||
          (term.length >= 4 &&
            Math.abs(word.length - term.length) <= 1 &&
            editDistance(word, term) <= 1),
      ),
    );
  });
}
