import { ProductComparison } from "@/components/product-comparison";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Footwear",
  description: "Compare cushioning, heel drop, stack height, weight, and support across Morrow footwear models.",
};

export default function ComparePage() {
  return <main id="main-content" tabIndex={-1}><ProductComparison /></main>;
}
