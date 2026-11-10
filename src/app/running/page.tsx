import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Performance Running Shoes",
  description: "Fictional road and trail running concepts with sample fit and technical information.",
};

export default function RunningPage() {
  const runningShoes = products.filter((p) => p.category === "Running" || p.category === "Trail");

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={runningShoes} title="Performance Running Footwear" initialCategory="Running" />
    </main>
  );
}
