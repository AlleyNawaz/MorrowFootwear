import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men's Footwear Collection",
  description: "Road running, gym training, outdoor hiking, and everyday casual sneakers engineered with supercritical nitrogen cushioning.",
};

export default function MenPage() {
  const menShoes = products.filter((p) => p.audience.includes("Men"));

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={menShoes} title="Men's Footwear Collection" initialAudience="Men" />
    </main>
  );
}
