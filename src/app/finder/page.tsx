import { ShoeFinder } from "@/components/shoe-finder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shoe Finder Quiz",
  description: "Explore sample footwear by activity, cushioning, structure and surface. Shopping guidance, not a fit guarantee.",
  alternates: { canonical: "/finder" },
};

export default function FinderPage() {
  return <ShoeFinder />;
}
