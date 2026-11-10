"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/catalog";
import { useStore } from "./store-provider";
import { Icon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWish, comparisonSlugs, toggleCompare } = useStore();
  const [activeColorIndex, setActiveColorIndex] = useState(0);

  const isWishlisted = wishlist.includes(product.slug);
  const isCompared = comparisonSlugs.includes(product.slug);
  const activeColor = product.colors[activeColorIndex] || product.colors[0];

  return (
    <article className="product-card" aria-labelledby={`product-title-${product.slug}`}>
      <div className="product-card-media">
        <div className="product-badge-group">
          {product.badge && (
            <span
              className={`badge ${
                product.badge === "New" ? "new" : product.badge === "Demo sale" ? "sale" : "subtle"
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        <button
          className={`wishlist-toggle-btn ${isWishlisted ? "saved" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWish(product);
          }}
          aria-label={isWishlisted ? `Remove ${product.name} from saved items` : `Save ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <Icon name="heart" size={18} />
        </button>

        <Link style={{ position: "absolute", inset: 0 }} href={`/products/${product.slug}?color=${encodeURIComponent(activeColor.name)}`} aria-label={`View ${product.name} in ${activeColor.name}`}>
          <Image
            src={activeColor.image}
            alt={`${product.name} shown in ${activeColor.name} colorway`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="product-card-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="product-card-category">{product.category}</span>
          <div className="swatches" aria-label={`${product.colors.length} color options`}>
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                className="swatch-dot"
                style={{
                  background: c.hex,
                  transform: activeColorIndex === i ? "scale(1.2)" : "scale(1)",
                  boxShadow: activeColorIndex === i ? "0 0 0 2px var(--brand-cobalt)" : "none",
                  cursor: "pointer",
                }}
                title={c.name}
                aria-label={`Show ${c.name} colorway`}
                onClick={() => setActiveColorIndex(i)}
              />
            ))}
          </div>
        </div>

        <Link href={`/products/${product.slug}?color=${encodeURIComponent(activeColor.name)}`}>
          <h3 id={`product-title-${product.slug}`} className="product-card-name">
            {product.name}
          </h3>
        </Link>

        <p className="product-card-benefit">{product.benefit}</p>

        <div className="product-card-footer">
          <div>
            <span className="product-card-price">{formatMoney(product.price)}</span>
            {product.compareAtPrice && (
              <span className="product-card-compare-price">{formatMoney(product.compareAtPrice)}</span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => toggleCompare(product.slug)}
            style={{
              fontSize: "0.78rem",
              padding: "4px 8px",
              color: isCompared ? "var(--brand-cobalt)" : "var(--text-tertiary)",
            }}
            aria-pressed={isCompared}
          >
            <Icon name="sliders" size={14} />
            <span>{isCompared ? "Compared" : "Compare"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
