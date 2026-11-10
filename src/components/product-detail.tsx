"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product, SizeSystem } from "@/lib/types";
import { formatMoney } from "@/lib/catalog";
import { productSizeLabel } from "@/lib/sizing";
import { useStore } from "./store-provider";
import { Icon } from "./icons";
import { FitDialog } from "./fit-dialog";
import { useUrlField } from "./use-url-field";

export function ProductDetail({ product }: { product: Product }) {
  const {
    add,
    wishlist,
    toggleWish,
    sizeSystem,
    setSizeSystem,
    toggleCompare,
    comparisonSlugs,
  } = useStore();

  const [colorName, setColorName] = useUrlField(
    "color",
    product.colors[0].name,
  );
  const selectedColorIndex = Math.max(
    0,
    product.colors.findIndex((c) => c.name === colorName),
  );
  const setSelectedColorIndex = (index: number) =>
    setColorName(product.colors[index].name);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedWidth, setSelectedWidth] = useState(
    product.variants[0]?.widths[0] || "Standard",
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const activeColor = product.colors[selectedColorIndex] || product.colors[0];
  const activeVariant =
    product.variants.find((variant) => variant.color === activeColor.name) ??
    product.variants[0];
  const isWishlisted = wishlist.includes(product.slug);
  const isCompared = comparisonSlugs.includes(product.slug);

  const isSoldOut = activeVariant.inventory.kind === "sold_out";
  const isComingSoon = activeVariant.inventory.kind === "coming_soon";
  const isLowStock = activeVariant.inventory.kind === "low_stock";
  const isUnavailable = !["in_stock", "low_stock"].includes(
    activeVariant.inventory.kind,
  );

  const galleryImages = [
    { label: "Concept image — sample media", src: activeColor.image },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    add(
      product,
      activeVariant.id,
      activeColor.name,
      selectedSize,
      selectedWidth,
    );
  };

  return (
    <main id="main-content" className="page container">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumbs"
        style={{
          display: "flex",
          gap: "8px",
          fontSize: "0.85rem",
          color: "var(--text-tertiary)",
          marginBottom: "24px",
        }}
      >
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/${product.category.toLowerCase()}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {product.name}
        </span>
      </nav>

      <div className="pdp-grid">
        {/* Left: Product Gallery */}
        <div>
          <div className="pdp-gallery-main">
            <Image
              src={galleryImages[selectedImageIndex].src}
              alt={`${product.name} — ${galleryImages[selectedImageIndex].label}`}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            {product.badge && (
              <div style={{ position: "absolute", top: "18px", left: "18px" }}>
                <span
                  className={`badge ${product.badge === "New" ? "new" : product.badge === "Demo sale" ? "sale" : "subtle"}`}
                >
                  {product.badge}
                </span>
              </div>
            )}
          </div>

          <div
            className="pdp-gallery-thumbs"
            aria-label="Product image thumbnails"
          >
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                className={`pdp-thumb ${selectedImageIndex === idx ? "active" : ""}`}
                onClick={() => setSelectedImageIndex(idx)}
                aria-label={`View ${img.label}`}
              >
                <Image src={img.src} alt="" fill sizes="15vw" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sticky Purchasing Details */}
        <div className="pdp-sticky-panel">
          <div className="pdp-header">
            <span className="eyebrow">
              {product.category} · PERFORMANCE LINE
            </span>
            <h1>{product.name}</h1>
            <p>
              Sample product, price, images and specifications. Color imagery is
              illustrative, not a verified production color match.
            </p>

            <div className="pdp-price-wrap">
              <span className="pdp-price">{formatMoney(product.price)}</span>
              {product.compareAtPrice && (
                <span
                  style={{
                    fontSize: "1.1rem",
                    textDecoration: "line-through",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {formatMoney(product.compareAtPrice)}
                </span>
              )}

              <div className="pdp-rating">
                <Icon name="star" size={16} />
                <span style={{ fontWeight: 700 }}>
                  {product.rating.average.toFixed(1)}
                </span>
                <span style={{ color: "var(--text-tertiary)" }}>
                  ({product.rating.count} sample reviews · demo)
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "var(--text-secondary)",
              }}
            >
              {product.description}
            </p>
          </div>

          {/* Colorway Selection */}
          <div className="pdp-selector-group">
            <div className="pdp-selector-label">
              <span>
                Color: <strong>{activeColor.name}</strong>
              </span>
              <span
                style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}
              >
                {product.colors.length} available
              </span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    setSelectedColorIndex(i);
                    setSelectedImageIndex(0);
                  }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-full)",
                    background: c.hex,
                    border: "2px solid #fff",
                    boxShadow:
                      selectedColorIndex === i
                        ? "0 0 0 2px var(--brand-cobalt)"
                        : "0 0 0 1px var(--border-strong)",
                    cursor: "pointer",
                    transform:
                      selectedColorIndex === i ? "scale(1.1)" : "scale(1)",
                    transition: "all var(--transition-fast)",
                  }}
                  aria-label={`Select ${c.name} colorway`}
                  aria-pressed={selectedColorIndex === i}
                />
              ))}
            </div>
          </div>

          {/* Size System & Sizing Matrix */}
          <div className="pdp-selector-group">
            <div className="pdp-selector-label">
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span>Size ({sizeSystem})</span>
                {/* Size System switcher */}
                <div
                  style={{
                    display: "flex",
                    gap: "4px",
                    background: "var(--bg-subtle)",
                    padding: "2px",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {(["US", "UK", "EU", "CM"] as SizeSystem[]).map((sys) => (
                    <button
                      key={sys}
                      type="button"
                      onClick={() => setSizeSystem(sys)}
                      aria-pressed={sizeSystem === sys}
                      style={{
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        border: "none",
                        borderRadius: "var(--radius-xs)",
                        background:
                          sizeSystem === sys
                            ? "var(--bg-surface)"
                            : "transparent",
                        color:
                          sizeSystem === sys
                            ? "var(--text-primary)"
                            : "var(--text-tertiary)",
                        boxShadow:
                          sizeSystem === sys ? "var(--shadow-sm)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      {sys}
                    </button>
                  ))}
                </div>
              </div>

              <FitDialog />
            </div>

            <div className="size-pill-grid">
              {activeVariant.sizes.map((s) => {
                const displaySize = productSizeLabel(s, sizeSystem);
                const isSelected = selectedSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    className={`size-pill ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedSize(s)}
                    aria-pressed={isSelected}
                  >
                    {displaySize}
                  </button>
                );
              })}
            </div>
            {!selectedSize && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--brand-coral)",
                  marginTop: "6px",
                }}
              >
                Please select a size to proceed
              </p>
            )}
            {sizeSystem !== "US" && <p className="text-xs">Sample adult conversions. Sizes absent from the chart, including kids’ sizes, retain their US label.</p>}
          </div>

          {/* Width Selection */}
          {activeVariant.widths.length > 1 && (
            <div className="pdp-selector-group">
              <div className="pdp-selector-label">
                <span>
                  Width: <strong>{selectedWidth}</strong>
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {activeVariant.widths.map((w) => (
                  <button
                    key={w}
                    type="button"
                    className={`btn btn-sm ${selectedWidth === w ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => setSelectedWidth(w)}
                    aria-pressed={selectedWidth === w}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory Callout */}
          <div
            style={{
              margin: "16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.88rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "var(--radius-full)",
                background: isUnavailable
                  ? "var(--text-tertiary)"
                  : isLowStock
                    ? "var(--brand-coral)"
                    : "#10b981",
              }}
            />
            <span>
              {isSoldOut
                ? "Currently sold out"
                : isComingSoon
                  ? "Coming soon — Available Oct 1"
                  : isLowStock
                    ? "Sample low-stock state — not live inventory"
                    : "Sample availability — no real inventory or shipping"}
            </span>
          </div>

          {/* Purchase CTAs */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              type="button"
              className="btn btn-primary btn-wide btn-lg"
              disabled={isUnavailable || !selectedSize}
              onClick={handleAddToCart}
              style={{ opacity: isUnavailable || !selectedSize ? 0.6 : 1 }}
            >
              {isSoldOut
                ? "Sold Out"
                : isComingSoon
                  ? "Coming Soon"
                  : !selectedSize
                    ? "Select Size"
                    : "Add to Bag ⌣"}
            </button>

            <button
              type="button"
              className={`action-btn ${isWishlisted ? "saved" : ""}`}
              onClick={() => toggleWish(product)}
              style={{
                width: "56px",
                height: "56px",
                border: "1px solid var(--border-strong)",
              }}
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Save to wishlist"
              }
            >
              <Icon name="heart" size={22} />
            </button>
          </div>

          {/* Compare Link */}
          <div style={{ marginBottom: "24px" }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => toggleCompare(product.slug)}
              style={{
                padding: "6px 0",
                color: isCompared
                  ? "var(--brand-cobalt)"
                  : "var(--text-secondary)",
              }}
            >
              <Icon name="sliders" size={16} />
              <span>
                {isCompared
                  ? "Remove from comparison matrix"
                  : "Add to side-by-side comparison"}
              </span>
            </button>
          </div>

          {/* Technical Specs Grid */}
          <div className="pdp-specs-grid">
            <div className="pdp-spec-item">
              <dt>Cushioning</dt>
              <dd>{product.cushioning}</dd>
            </div>
            <div className="pdp-spec-item">
              <dt>Support Level</dt>
              <dd>{product.support}</dd>
            </div>
            <div className="pdp-spec-item">
              <dt>Heel-to-Toe Drop</dt>
              <dd>{product.dropMm} mm</dd>
            </div>
            <div className="pdp-spec-item">
              <dt>Weight (Mens 9)</dt>
              <dd>{product.weightGrams} g</dd>
            </div>
            <div className="pdp-spec-item">
              <dt>Stack Height</dt>
              <dd>{product.stackHeightMm} mm</dd>
            </div>
            <div className="pdp-spec-item">
              <dt>Best Surface</dt>
              <dd>{product.terrain}</dd>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "18px",
              borderRadius: "var(--radius-md)",
              background: "var(--bg-subtle)",
              fontSize: "0.86rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon name="truck" size={18} />
              <span>
                Sample shipping costs are shown at demo checkout. No delivery
                date is promised.
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon name="rotate-ccw" size={18} />
              <span>
                Returns are simulated. Final eligibility, fees and timelines are
                not approved.
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon name="shield" size={18} />
              <span>Warranty terms require approval before any real sale.</span>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="accordion">
            <details className="accordion-item" open>
              <summary className="accordion-summary">
                <span>Features & Engineered Design</span>
                <Icon name="chevron" size={16} />
              </summary>
              <div className="accordion-content">
                <ul
                  style={{
                    paddingLeft: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="accordion-item">
              <summary className="accordion-summary">
                <span>Fit & Sizing Recommendations</span>
                <Icon name="chevron" size={16} />
              </summary>
              <div className="accordion-content">
                <p>{product.fit}</p>
              </div>
            </details>

            <details className="accordion-item">
              <summary className="accordion-summary">
                <span>Materials & Care</span>
                <Icon name="chevron" size={16} />
              </summary>
              <div className="accordion-content">
                <ul style={{ paddingLeft: "20px", marginBottom: "12px" }}>
                  {product.materials.map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
                <p>
                  <strong>Care:</strong> {product.care}
                </p>
                <p style={{ marginTop: "4px" }}>
                  <strong>Origin:</strong> {product.origin}
                </p>
                <p
                  style={{
                    marginTop: "4px",
                    fontSize: "0.75rem",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Style Code: {product.styleCode}
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
