import { CartView } from "@/components/cart-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review items in your shopping bag and calculate shipping and promotional discounts.",
};

export default function CartPage() {
  return <CartView />;
}
