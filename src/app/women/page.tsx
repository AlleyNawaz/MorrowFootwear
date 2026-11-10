import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Women's Footwear Collection",
  description: "Performance running, walking, court, and recovery shoes sculpted for women's biomechanics and foot shapes.",
};

export default function WomenPage() {
  const womenShoes = products.filter((p) => p.audience.includes("Women"));

  return (
    <main id="main-content" className="page container">
      <ProductGrid items={womenShoes} title="Women's Footwear Collection" initialAudience="Women" />
    </main>
  );
}
