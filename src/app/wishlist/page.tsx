"use client";

import Link from "next/link";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";

export default function WishlistPage() {
  const { wishlist } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.slug));

  return (
    <main id="main-content" className="page container">
      <div style={{ marginBottom: "32px" }}>
        <p className="eyebrow">SAVED ITEMS</p>
        <h1>Your Wishlist</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>
          {savedProducts.length} {savedProducts.length === 1 ? "pair" : "pairs"} saved for later
        </p>
      </div>

      {savedProducts.length > 0 ? (
        <div className="product-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "80px 24px",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ fontSize: "3rem", color: "var(--brand-smile)", display: "block", marginBottom: "16px" }}>
            ⌣
          </span>
          <h2>No saved items yet</h2>
          <p style={{ maxWidth: "440px", margin: "10px auto 28px", color: "var(--text-secondary)" }}>
            Tap the heart on any shoe while browsing to keep track of styles, sizes, and colors you love.
          </p>
          <Link href="/new" className="btn btn-primary">
            Explore Footwear Range
          </Link>
        </div>
      )}
    </main>
  );
}
