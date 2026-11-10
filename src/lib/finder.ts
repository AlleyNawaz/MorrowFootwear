import { z } from "zod";
import type { Product } from "./types";

export const finderSchema = z.object({
  activity: z.enum(["Running", "Walking", "Training", "Trail", "Lifestyle"]).optional(),
  cushioning: z.enum(["Soft", "Balanced", "Responsive"]).optional(),
  support: z.enum(["Neutral", "Guided", "Maximum"]).optional(),
  surface: z.enum(["road", "trail", "indoor"]).optional(),
});
export type FinderAnswers = z.infer<typeof finderSchema>;
export type FinderField = keyof FinderAnswers;
export interface FinderRecommendation {
  product: Product;
  matches: string[];
  tradeoffs: string[];
  score: number;
}

export function rankShoes(products: Product[], input: unknown): FinderRecommendation[] {
  const answers = finderSchema.parse(input);
  const surfaces = { road: /road|pavement|sidewalk|street/i, trail: /trail|gravel|mud|rock/i, indoor: /gym|floor|hardwood|studio|court/i };
  return products.filter(p => p.variants.some(v => ["in_stock", "low_stock"].includes(v.inventory.kind))).map(product => {
    const matches: string[] = [];
    const tradeoffs: string[] = [];
    let score = 0;
    function check(matchesAnswer: boolean, label: string, weight: number) {
      if (matchesAnswer) { matches.push(label); score += weight; }
      else tradeoffs.push(label);
    }
    if (answers.activity) check(product.category === answers.activity || (answers.activity === "Trail" && product.category === "Hiking"), `${answers.activity} use case`, 4);
    if (answers.cushioning) check(product.cushioning === answers.cushioning, `${answers.cushioning} cushioning`, 2);
    if (answers.support) check(product.support === answers.support, `${answers.support} structure`, 2);
    if (answers.surface) check(surfaces[answers.surface].test(product.terrain), `${answers.surface} surface`, 2);
    return { product, score, matches, tradeoffs };
  }).sort((a, b) => b.score - a.score).slice(0, 3);
}
