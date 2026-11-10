import type { ProductCategory } from "@/lib/types";
export interface Collection {
  slug: string;
  title: string;
  description: string;
  categories: ProductCategory[];
}
export const collections: Collection[] = [
  { slug: "daily-motion", title: "Daily motion", description: "Running, walking and everyday silhouettes. A sample collection for the routes you know and the detours you choose.", categories: ["Running", "Walking", "Lifestyle"] },
  { slug: "outside-lines", title: "Outside the lines", description: "Trail, hiking and weather-minded concepts. Sample specifications, ready for a closer look—not a promise of tested protection.", categories: ["Trail", "Hiking", "Boots"] },
  { slug: "court-and-studio", title: "Court & studio", description: "Training and court concepts, brought together by their intended setting. Explore construction and fit before choosing.", categories: ["Training", "Court", "Basketball"] },
];
