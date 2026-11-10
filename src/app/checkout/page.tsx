import { Checkout } from "@/components/forms";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Sample checkout with local address validation and simulated payment. No real purchase occurs.",
};

export default function CheckoutPage() {
  return <Checkout />;
}
