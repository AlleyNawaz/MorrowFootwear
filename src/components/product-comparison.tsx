"use client";

import Image from "next/image";
import Link from "next/link";
import { products, formatMoney } from "@/lib/catalog";
import { useStore } from "./store-provider";
import { Icon } from "./icons";

export function ProductComparison() {
  const { comparisonSlugs, toggleCompare, clearCompare } = useStore();

  const comparedProducts = comparisonSlugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => p !== undefined);

  if (comparedProducts.length < 2) {
    return (
      <div className="container-narrow" style={{ textAlign: "center", padding: "80px 24px" }}>
        <span style={{ fontSize: "3rem", display: "block", color: "var(--brand-smile)", marginBottom: "16px" }}>⌣</span>
        <p className="eyebrow">FOOTWEAR COMPARISON MATRIX</p>
        <h1>Compare Morrow Shoes</h1>
        <p style={{ maxWidth: "480px", margin: "12px auto 32px", color: "var(--text-secondary)" }}>
          Select 2 to 4 shoes to see differences in cushioning, heel-to-toe drop, weight, stack height, and underfoot support.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px", marginBottom: "32px" }}>
          {products.slice(0, 5).map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => toggleCompare(p.slug)}
              aria-pressed={comparisonSlugs.includes(p.slug)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: "var(--radius-full)" }}
            >
              {comparisonSlugs.includes(p.slug) ? "− Remove" : "+ Add"} {p.name}
            </button>
          ))}
        </div>

        <Link href="/new" className="btn btn-primary">
          Browse All Footwear
        </Link>
      </div>
    );
  }

  const rows = [
    { label: "Category", getVal: (p: (typeof products)[0]) => p.category },
    { label: "Price", getVal: (p: (typeof products)[0]) => formatMoney(p.price) },
    { label: "Cushioning", getVal: (p: (typeof products)[0]) => p.cushioning },
    { label: "Support Level", getVal: (p: (typeof products)[0]) => p.support },
    { label: "Heel Drop", getVal: (p: (typeof products)[0]) => `${p.dropMm} mm` },
    { label: "Stack Height", getVal: (p: (typeof products)[0]) => `${p.stackHeightMm} mm` },
    { label: "Weight (Mens 9)", getVal: (p: (typeof products)[0]) => `${p.weightGrams} g` },
    { label: "Best Terrain", getVal: (p: (typeof products)[0]) => p.terrain },
    { label: "Primary Upper", getVal: (p: (typeof products)[0]) => p.materials[0] },
    { label: "Country of Origin", getVal: (p: (typeof products)[0]) => p.origin },
  ];

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
        <div>
          <p className="eyebrow">TECHNICAL MATRIX</p>
          <h1>Shoe Comparison</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Comparing {comparedProducts.length} models side-by-side.
          </p>
        </div>
        <button type="button" onClick={clearCompare} className="btn btn-ghost btn-sm" style={{ color: "var(--brand-coral)" }}>
          Clear Matrix
        </button>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: "200px" }}>Attribute</th>
              {comparedProducts.map((product) => (
                <th key={product.slug} style={{ minWidth: "220px", verticalAlign: "top" }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-subtle)", marginBottom: "12px" }}>
                    <Image src={product.colors[0].image} alt={product.name} fill sizes="220px" style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, display: "block", color: "var(--text-primary)" }}>{product.name}</span>
                      <span style={{ fontSize: "0.95rem", color: "var(--brand-cobalt)", fontWeight: 700 }}>{formatMoney(product.price)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCompare(product.slug)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: "4px", color: "var(--text-tertiary)" }}
                      aria-label={`Remove ${product.name} from comparison`}
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <Link href={`/products/${product.slug}`} className="btn btn-primary btn-sm btn-wide">
                      View Model
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              // Check if values differ across compared products
              const vals = comparedProducts.map((p) => row.getVal(p));
              const isDifferent = new Set(vals).size > 1;

              return (
                <tr key={row.label} style={{ background: isDifferent ? "var(--bg-canvas)" : "transparent" }}>
                  <td style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                    {row.label}
                    {isDifferent && <span style={{ marginLeft: "6px", fontSize: "0.75rem", color: "var(--brand-cobalt)" }}>• differs</span>}
                  </td>
                  {comparedProducts.map((product) => (
                    <td key={product.slug} style={{ fontWeight: isDifferent ? 700 : 500, color: "var(--text-primary)" }}>
                      {row.getVal(product)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
