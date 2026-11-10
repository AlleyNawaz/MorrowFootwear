import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Commercial Demo Notice",
  description: "Terms and conditions governing the use of the Morrow demo commerce experience.",
};

export default function TermsPage() {
  return (
    <main id="main-content" className="page container-narrow">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p className="eyebrow">LEGAL & COMMERCIAL POLICIES</p>
        <h1>Terms of Service</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Clear, transparent policies for the Morrow footwear digital experience.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
        <section style={{ background: "var(--warning-bg)", color: "var(--warning-text)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid #fcd34d" }}>
          <strong style={{ display: "block", fontSize: "1.1rem", marginBottom: "6px" }}>Commercial Demo Notice</strong>
          This website is a realistic, interactive e-commerce implementation demonstrating high-polish retail design, accessibility, and TypeScript architecture. Products, prices, reviews, and transactions are simulated samples. No real charges or commercial shipments are generated.
        </section>

        <section>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
            1. Intellectual Property & Originality
          </h2>
          <p>
            The Morrow brand, typography hierarchy, footwear designs, shoe names, colorway narratives, and codebase are bespoke and original. Benchmark footwear brands mentioned in design references are the trademarks of their respective owners and have no affiliation with this project.
          </p>
        </section>

        <section>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
            2. Customer Guarantees
          </h2>
          <p>
            In production commerce operations, Morrow products are backed by:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <li>30-day outdoor wear trial with complimentary return shipping.</li>
            <li>1-year limited craftsmanship warranty against structural delamination.</li>
            <li>Guaranteed transparent pricing with no deceptive countdown scarcity.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
