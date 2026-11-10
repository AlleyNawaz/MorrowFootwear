import { ReturnStart } from "@/components/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Start a return, request a free size exchange, or file a warranty review for your Morrow footwear.",
};

export default function ReturnsPage() {
  return <ReturnStart />;
}
