import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifestyle & Casual Footwear",
  description: "Minimalist organic canvas sneakers, active sandals, and weather-ready boots designed for daily life and unhurried movement.",
};

export default function LifestylePage() {
  const lifestyleShoes = products.filter(
    (p) => p.category === "Lifestyle" || p.category === "Sandals" || p.category === "Boots"
  );

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={lifestyleShoes} title="Lifestyle & Everyday Footwear" initialCategory="Lifestyle" />
    </main>
  );
}
