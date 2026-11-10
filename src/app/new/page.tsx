import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Explore the latest footwear releases from Morrow. Engineered for road running, walking, trail exploration, and daily comfort.",
};

export default function NewArrivalsPage() {
  return (
    <main id="main-content" className="page container">
      <ProductGrid items={products} title="New Arrivals & Full Catalog" />
    </main>
  );
}
