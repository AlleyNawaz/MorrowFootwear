import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kids & Adaptive Footwear",
  description: "Durable, flexible, easy-entry shoes engineered for growing feet and natural barefoot arch development.",
};

export default function KidsPage() {
  const kidsShoes = products.filter((p) => p.audience.includes("Kids"));

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={kidsShoes} title="Kids & Adaptive Movement" initialAudience="Kids" />
    </main>
  );
}
