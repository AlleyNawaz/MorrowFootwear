import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Walking & All-Day Comfort Shoes",
  description: "Supportive walking shoes and recovery slides designed for healthcare professionals, travel, and long days on your feet.",
};

export default function WalkingPage() {
  const walkingShoes = products.filter((p) => p.category === "Walking" || p.category === "Recovery");

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={walkingShoes} title="Walking & All-Day Comfort" initialCategory="Walking" />
    </main>
  );
}
