import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { products } from "@/lib/catalog";
export const metadata: Metadata = {
  title: "Recovery category concepts",
  description: "Sample slip-on footwear concepts. No therapeutic or recovery outcomes are claimed.",
  alternates: { canonical: "/recovery" },
};
export default function RecoveryPage() {
  return <main id="main-content" className="page container"><ProductGrid title="Slip into something simpler" items={products.filter(p => p.category === "Recovery")} /></main>;
}
