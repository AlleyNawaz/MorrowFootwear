"use client";

import { useMemo } from "react";
import { useUrlField } from "./use-url-field";
import { searchProducts } from "@/lib/search";
import { products } from "@/lib/catalog";
import { ProductCard } from "./product-card";
import { useStore } from "./store-provider";
import { Icon } from "./icons";

export function SearchView() {
  const [query, setQuery] = useUrlField("q", "");
  const { recentSearches, addRecentSearch, clearRecentSearches } = useStore();

  const results = useMemo(() => searchProducts(products, query), [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  return (
    <main id="main-content" className="page container">
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 40px" }}>
        <p className="eyebrow">PREDICTIVE SEARCH</p>
        <h1>Find Your Perfect Stride</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Search by shoe model, activity (running, walking, gym), cushioning level, or feature.
        </p>

        <form onSubmit={handleSearchSubmit} style={{ marginTop: "24px", position: "relative" }}>
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 'Daybreak', 'Softstep', 'Running', 'Trail'..."
            className="form-input"
            style={{ paddingLeft: "48px", fontSize: "1.1rem", height: "56px", borderRadius: "var(--radius-full)" }}
            aria-label="Search footwear catalog"
          />
          <div style={{ position: "absolute", left: "18px", top: "18px", color: "var(--text-tertiary)" }}>
            <Icon name="search" size={20} />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{ position: "absolute", right: "18px", top: "18px", background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}
              aria-label="Clear search input"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </form>

        {/* Quick search chips */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)", alignSelf: "center" }}>Try an activity:</span>
          {["Running", "Walking", "Trail", "Daybreak", "Cushioned", "Gym"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: "var(--radius-full)", padding: "4px 12px", fontSize: "0.8rem" }}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", fontSize: "0.82rem", color: "var(--text-tertiary)" }}>
            <span>Recent:</span>
            {recentSearches.slice(0, 4).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                style={{ background: "none", border: "none", color: "var(--brand-cobalt)", cursor: "pointer", textDecoration: "underline" }}
              >
                {q}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              style={{ background: "none", border: "none", color: "var(--text-tertiary)", cursor: "pointer", marginLeft: "8px" }}
              aria-label="Clear search history"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.2rem" }}>
          {query ? `Results for “${query}” (${results.length})` : "The current edit"}
        </h2>
      </div>

      {results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px 24px", background: "var(--bg-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
          <span style={{ fontSize: "2.5rem", color: "var(--brand-smile)", display: "block", marginBottom: "12px" }}>⌣</span>
          <h2>No matching shoes found</h2>
          <p style={{ maxWidth: "400px", margin: "8px auto 20px", color: "var(--text-secondary)" }}>
            Check for typos or try searching for general categories like &ldquo;Running&rdquo; or &ldquo;Walking&rdquo;.
          </p>
          <button type="button" onClick={() => setQuery("")} className="btn btn-secondary">
            Clear Search
          </button>
        </div>
      )}
    </main>
  );
}
