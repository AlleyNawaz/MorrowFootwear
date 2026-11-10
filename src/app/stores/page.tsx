import { StoreLocator } from "@/components/store-locator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flagship Stores & Fitting Hubs",
  description: "Find Morrow flagship retail stores in New York, Chicago, San Francisco, and London for gait analysis and local pickup.",
};

export default function StoresPage() {
  return (
    <main id="main-content" className="page">
      <StoreLocator />
    </main>
  );
}
