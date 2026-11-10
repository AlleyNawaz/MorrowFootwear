"use client";

import { useState } from "react";
import { STORES } from "@/lib/stores-data";
import { Icon } from "./icons";

export function StoreLocator() {
  const [query, setQuery] = useState("");

  const filteredStores = STORES.filter((store) => {
    const haystack = `${store.name} ${store.city} ${store.state} ${store.country} ${store.address} ${store.postalCode} ${store.metroArea}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="container" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 40px" }}>
        <p className="eyebrow">PHYSICAL EXPERIENCES</p>
        <h1>Morrow Flagships & Fitting Hubs</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Experience in-store treadmill gait analysis, custom arch testing, 2-hour local pickup, and circular take-back recycling.
        </p>

        <div style={{ marginTop: "24px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search by city (e.g. New York, Chicago, London) or postal code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "48px", height: "54px", borderRadius: "var(--radius-full)" }}
            aria-label="Search stores"
          />
          <div style={{ position: "absolute", left: "18px", top: "18px", color: "var(--text-tertiary)" }}>
            <Icon name="map-pin" size={20} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px" }}>
        {filteredStores.map((store) => (
          <article
            key={store.id}
            style={{
              background: "var(--bg-surface)",
              padding: "28px",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-subtle)",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <span className="badge new">Flagship Hub</span>
                <span style={{ fontSize: "0.82rem", color: "#10b981", fontWeight: 700 }}>● Open Today</span>
              </div>

              <h2 style={{ fontSize: "1.35rem", marginBottom: "6px" }}>{store.name}</h2>
              <p style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {store.address}
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {store.city}, {store.state} {store.postalCode} · {store.country}
              </p>
              <p style={{ color: "var(--brand-cobalt)", fontSize: "0.9rem", marginTop: "4px" }}>
                {store.phone}
              </p>

              {/* Hours */}
              <div style={{ margin: "20px 0", padding: "14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", fontSize: "0.85rem" }}>
                <strong style={{ display: "block", marginBottom: "6px" }}>Operating Hours:</strong>
                {store.hours.map((h, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
                    <span>{h.days}</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>

              {/* Services */}
              <div>
                <strong style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-tertiary)" }}>
                  In-Store Services
                </strong>
                <ul style={{ listStyle: "none", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.88rem" }}>
                  {store.services.map((s, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Icon name="check" size={14} className="text-cobalt" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "10px" }}>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${store.address}, ${store.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm btn-wide"
              >
                <span>Get Directions</span>
                <Icon name="external" size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
