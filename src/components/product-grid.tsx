"use client";

import { useMemo, useState } from "react";
import type {
  Product,
  ProductCategory,
  Audience,
} from "@/lib/types";
import { ProductCard } from "./product-card";
import { useUrlField } from "./use-url-field";
import { Icon } from "./icons";

interface ProductGridProps {
  items: Product[];
  title?: string;
  initialCategory?: ProductCategory | "All";
  initialAudience?: Audience | "All";
}

export function ProductGrid({
  items,
  title = "Explore The Range",
  initialCategory = "All",
  initialAudience = "All",
}: ProductGridProps) {
  const [sort, setSort] = useUrlField("sort", "featured");
  const [selectedCategory, setSelectedCategory] = useUrlField(
    "category",
    initialCategory,
  );
  const [selectedAudience, setSelectedAudience] = useUrlField(
    "audience",
    initialAudience,
  );
  const [selectedCushion, setSelectedCushion] = useUrlField(
    "cushioning",
    "All",
  );
  const [selectedSupport, setSelectedSupport] = useUrlField("support", "All");
  const [stock, setStock] = useUrlField("stock", "all");
  const [size, setSize] = useUrlField("size", "All");
  const [width, setWidth] = useUrlField("width", "All");
  const [price, setPrice] = useUrlField("price", "All");
  const [pageValue, setPage] = useUrlField("page", "1");
  const inStockOnly = stock === "available";
  const setInStockOnly = (value: boolean) =>
    setStock(value ? "available" : "all");
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const audiences = ["All", "Men", "Women", "Kids", "Unisex"];
  const cushions = ["All", "Soft", "Balanced", "Responsive"];
  const supports = ["All", "Neutral", "Guided", "Maximum"];
  const sizes = ["All", ...new Set(items.flatMap(p => p.variants.flatMap(v => v.sizes)))];
  const widths = ["All", ...new Set(items.flatMap(p => p.variants.flatMap(v => v.widths)))];

  const filteredProducts = useMemo(() => {
    let list = [...items];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (selectedAudience !== "All") {
      list = list.filter((p) =>
        p.audience.some(audience => audience === selectedAudience),
      );
    }
    if (selectedCushion !== "All") {
      list = list.filter((p) => p.cushioning === selectedCushion);
    }
    if (selectedSupport !== "All") {
      list = list.filter((p) => p.support === selectedSupport);
    }
    if (inStockOnly) {
      list = list.filter((p) =>
        p.variants.some((v) =>
          ["in_stock", "low_stock"].includes(v.inventory.kind),
        ),
      );
    }
    list = list.filter(p => p.variants.some(v =>
      (size === "All" || v.sizes.includes(size)) &&
      (width === "All" || v.widths.includes(width)) &&
      (!inStockOnly || ["in_stock", "low_stock"].includes(v.inventory.kind)),
    ));
    if (price !== "All") list = list.filter(p => p.price.amount <= Number(price));

    if (sort === "price-asc") {
      list.sort((a, b) => a.price.amount - b.price.amount);
    } else if (sort === "price-desc") {
      list.sort((a, b) => b.price.amount - a.price.amount);
    } else if (sort === "rating") {
      list.sort((a, b) => b.rating.average - a.rating.average);
    } else if (sort === "newest") {
      list.sort(
        (a, b) => (b.badge === "New" ? 1 : 0) - (a.badge === "New" ? 1 : 0),
      );
    }

    return list;
  }, [
    items,
    selectedCategory,
    selectedAudience,
    selectedCushion,
    selectedSupport,
    inStockOnly,
    sort,
    size, width, price,
  ]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 6));
  const parsedPage = Number(pageValue);
  const currentPage = Number.isSafeInteger(parsedPage) ? Math.min(totalPages, Math.max(1, parsedPage)) : 1;
  const visibleProducts = filteredProducts.slice((currentPage - 1) * 6, currentPage * 6);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedAudience !== "All" ? 1 : 0) +
    (selectedCushion !== "All" ? 1 : 0) +
    (selectedSupport !== "All" ? 1 : 0) +
    (inStockOnly ? 1 : 0) + (size !== "All" ? 1 : 0) + (width !== "All" ? 1 : 0) + (price !== "All" ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedAudience("All");
    setSelectedCushion("All");
    setSelectedSupport("All");
    setInStockOnly(false);
    setSize("All"); setWidth("All"); setPrice("All"); setPage("1");
  };

  return (
    <div className="section" style={{ paddingTop: "16px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p className="eyebrow">CURATED COLLECTION / SAMPLE DATA</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <h1>{title}</h1>
            <p style={{ marginTop: "6px" }} role="status">
              Showing {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "style" : "styles"}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", maxWidth: "100%" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              aria-expanded={showFiltersMobile}
              aria-controls="catalog-filters"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Icon name="sliders" size={16} />
              <span>
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
            </button>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9rem",
                fontWeight: 600,
              }}
            >
              Sort
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage("1"); }}
                className="form-select"
                style={{
                  padding: "8px 14px",
                  width: "auto",
                  fontSize: "0.88rem",
                }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        id="catalog-filters"
        className="catalog-filters"
        data-open={showFiltersMobile}
        style={{
          background: "var(--bg-surface)",
          padding: "20px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)",
          marginBottom: "36px",
          display: showFiltersMobile ? "flex" : "none",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Category Pills */}
        <div>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Category
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                aria-pressed={selectedCategory === cat}
                type="button"
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ borderRadius: "var(--radius-full)" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Facets */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <label>Size (US sample sizing)<select className="form-select" value={size} onChange={e => { setSize(e.target.value); setPage("1"); }}>{sizes.map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Width<select className="form-select" value={width} onChange={e => { setWidth(e.target.value); setPage("1"); }}>{widths.map(value => <option key={value}>{value}</option>)}</select></label>
          <label>Sample price<select className="form-select" value={price} onChange={e => { setPrice(e.target.value); setPage("1"); }}><option value="All">Any price</option><option value="10000">Up to $100</option><option value="15000">Up to $150</option><option value="20000">Up to $200</option></select></label>
          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Audience
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="form-select"
              style={{ marginTop: "4px", padding: "8px 12px" }}
            >
              {audiences.map((aud) => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Cushioning
            <select
              value={selectedCushion}
              onChange={(e) => setSelectedCushion(e.target.value)}
              className="form-select"
              style={{ marginTop: "4px", padding: "8px 12px" }}
            >
              {cushions.map((cush) => (
                <option key={cush} value={cush}>
                  {cush}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Support Level
            <select
              value={selectedSupport}
              onChange={(e) => setSelectedSupport(e.target.value)}
              className="form-select"
              style={{ marginTop: "4px", padding: "8px 12px" }}
            >
              {supports.map((sup) => (
                <option key={sup} value={sup}>
                  {sup}
                </option>
              ))}
            </select>
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingTop: "20px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--brand-cobalt)",
                }}
              />
              <span>In-stock only</span>
            </label>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-ghost btn-sm"
                style={{ color: "var(--brand-coral)", fontWeight: 700 }}
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid or Empty state */}
      {activeFiltersCount > 0 && <div className="service-nav" aria-label="Active filters">
        {[["Category", selectedCategory, () => setSelectedCategory("All")], ["Audience", selectedAudience, () => setSelectedAudience("All")], ["Cushioning", selectedCushion, () => setSelectedCushion("All")], ["Support", selectedSupport, () => setSelectedSupport("All")], ["Size", size, () => setSize("All")], ["Width", width, () => setWidth("All")], ["Price", price, () => setPrice("All")]].map(([label, value, remove]) => typeof value === "string" && value !== "All" && typeof remove === "function" ? <button key={String(label)} className="btn btn-ghost btn-sm" onClick={() => { remove(); setPage("1"); }}>Remove {String(label)}: {value} ×</button> : null)}
        {inStockOnly && <button className="btn btn-ghost btn-sm" onClick={() => setInStockOnly(false)}>Remove in-stock filter ×</button>}
      </div>}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
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
          <span
            style={{
              fontSize: "3rem",
              display: "block",
              marginBottom: "16px",
              color: "var(--brand-smile)",
            }}
          >
            ⌣
          </span>
          <h2>No matching shoes found</h2>
          <p style={{ maxWidth: "440px", margin: "10px auto 24px" }}>
            We couldn’t find shoes matching all your current filters. Try
            resetting your criteria or browsing all categories.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-primary"
          >
            Reset All Filters
          </button>
        </div>
      )}
      {totalPages > 1 && <nav aria-label="Catalog pages" className="service-nav">
        <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setPage(String(currentPage - 1))}>Previous page</button>
        <span aria-live="polite">Page {currentPage} of {totalPages}</span>
        <button className="btn btn-secondary" disabled={currentPage === totalPages} onClick={() => setPage(String(currentPage + 1))}>Next page</button>
      </nav>}
    </div>
  );
}
