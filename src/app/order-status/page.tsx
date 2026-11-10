import { OrderStatus } from "@/components/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order Status",
  description: "Check fulfillment progress and carrier tracking for your Morrow order.",
};

export default function OrderStatusPage() {
  return <OrderStatus />;
}
