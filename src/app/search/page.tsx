import { SearchView } from "@/components/search-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Catalog",
  description: "Search Morrow running, walking, trail, and lifestyle footwear.",
};

export default function SearchPage() {
  return <SearchView />;
}
