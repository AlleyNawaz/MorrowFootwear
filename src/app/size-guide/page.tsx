import { SizeGuide } from "@/components/size-guide-modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size & Fit Guide",
  description: "International size conversion tables for US, UK, EU, and CM with heel-to-toe measurement instructions.",
};

export default function SizeGuidePage() {
  return (
    <main id="main-content" className="page">
      <SizeGuide />
    </main>
  );
}
