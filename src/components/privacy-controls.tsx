"use client";
import { useState } from "react";
import { analytics } from "@/lib/analytics";
import { saveOrders } from "@/lib/demo-orders";
import { useStore } from "./store-provider";
export function PrivacyControls() {
  const { clearLocalData } = useStore();
  const [message, setMessage] = useState("");
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">YOUR BROWSER / YOUR CHOICES</p>
      <h1>Privacy controls</h1>
      <p>
        No advertising or external analytics scripts are loaded. Cart, saved
        styles, size preferences and searches are stored locally. Demo order
        details are kept only in this tab’s session storage.
      </p>
      <div className="service-surface">
        <h2>Optional analytics</h2>
        <p>
          Disabled. No analytics destination is connected, so there is nothing
          to opt into.
        </p>
        <h2>Clear local demo data</h2>
        <p>
          This removes this browser’s Morrow bag, saved styles, searches,
          preferences and this tab’s orders and returns. It does not affect
          other websites.
        </p>
        <button
          className="btn btn-secondary"
          onClick={() => {
            try {
              for (const key of [
                "morrow.cart.v2",
                "morrow.wishlist.v2",
                "morrow.promo.v2",
                "morrow.sizesys.v2",
                "morrow.searches.v2",
                "morrow.compare.v2",
              ])
                localStorage.removeItem(key);
              saveOrders([]);
              analytics.clear();
              clearLocalData();
              setMessage(
                "Morrow demo data cleared. Your bag, saved items and order history are now empty.",
              );
            } catch {
              setMessage(
                "Storage is unavailable. Use your browser’s site-data controls.",
              );
            }
          }}
        >
          Clear Morrow demo data
        </button>
        <p role="status">{message}</p>
      </div>
    </main>
  );
}
