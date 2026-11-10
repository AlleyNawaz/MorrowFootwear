"use client";

import { useState } from "react";
import { SIZE_CHART, recommendSizeFromCm } from "@/lib/sizing";

export function SizeGuide() {
  const [measurementCm, setMeasurementCm] = useState<number>(26.5);
  const [gender, setGender] = useState<"Men" | "Women">("Men");

  const rec = recommendSizeFromCm(measurementCm, gender);

  return (
    <div className="container-narrow" style={{ paddingTop: "24px", paddingBottom: "80px" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <p className="eyebrow">SAMPLE FIT GUIDANCE</p>
        <h1>Footwear Size & Fit Guide</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Compare measurements and width. This sample chart does not guarantee fit or health outcomes.
        </p>
      </div>

      {/* Interactive foot measurement calculator */}
      <div style={{ background: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "12px" }}>Interactive Size Recommender</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "20px" }}>
          Measure your bare foot from the back of the heel to the tip of your longest toe in centimeters.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label className="form-label" htmlFor="calc-gender">Select Category</label>
            <select
              id="calc-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as "Men" | "Women")}
              className="form-select"
            >
              <option value="Men">Men&apos;s Sizing</option>
              <option value="Women">Women&apos;s Sizing</option>
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="calc-length">Foot Length (Centimeters): {measurementCm.toFixed(1)} cm</label>
            <input
              id="calc-length"
              type="range"
              min="21"
              max="31"
              step="0.5"
              value={measurementCm}
              onChange={(e) => setMeasurementCm(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "var(--brand-cobalt)", marginTop: "10px" }}
            />
          </div>
        </div>

        {rec && (
          <div style={{ padding: "20px", borderRadius: "var(--radius-md)", background: "var(--bg-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", display: "block" }}>Recommended Morrow Size:</span>
              <strong style={{ fontSize: "1.6rem", color: "var(--brand-cobalt)", fontFamily: "var(--font-display)" }}>
                US {gender === "Women" ? rec.usWomen : rec.usMen} ({rec.eu} EU / {rec.uk} UK)
              </strong>
            </div>
            <div style={{ textAlign: "right", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Includes a sample 0.5cm allowance; not a fit guarantee.
            </div>
          </div>
        )}
        {!rec && <p role="status">That measurement falls outside this sample chart. No size recommendation is available.</p>}
      </div>

      {/* Measurement Instructions */}
      <div style={{ background: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "16px" }}>How to Measure Your Foot at Home</h2>
        <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          <li>Tape a piece of blank paper to a hard, uncarpeted floor against a flat wall.</li>
          <li>Stand straight with your heel lightly pressing against the wall and your weight evenly distributed on both feet.</li>
          <li>Mark the tip of your longest toe on the paper with a pen held perpendicular to the floor.</li>
          <li>Measure the distance from the edge of the paper (heel) to your mark in centimeters.</li>
          <li>Repeat for both feet (choose the larger foot measurement).</li>
        </ol>
      </div>

      {/* Conversion Table */}
      <h2 style={{ fontSize: "1.3rem", marginBottom: "16px" }}>International Footwear Conversion Chart</h2>
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>US Men</th>
              <th>US Women</th>
              <th>UK</th>
              <th>EU</th>
              <th>CM</th>
              <th>Inches</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.usMen}>
                <td style={{ fontWeight: 700 }}>{row.usMen}</td>
                <td>{row.usWomen}</td>
                <td>{row.uk}</td>
                <td>{row.eu}</td>
                <td>{row.cm}</td>
                <td style={{ color: "var(--text-tertiary)" }}>{row.footLengthInches}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
