import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Morrow — Design Ethos & Origin",
  description: "Learn about the Morrow philosophy: creating footwear engineered for joyful human movement without unnecessary mass or marketing gimmicks.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page container-narrow">
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span style={{ fontSize: "3rem", color: "var(--brand-smile)", display: "block", marginBottom: "16px" }}>⌣</span>
        <p className="eyebrow">OUR ORIGIN & PHILOSOPHY</p>
        <h1>Footwear Made for How Bodies Actually Move</h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", marginTop: "12px", lineHeight: 1.6 }}>
          We started Morrow with a simple observation: modern athletic shoes had become over-complicated billboards of plastic overlays, rigid plastic plates, and manufactured hype.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
        <section>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.6rem", marginBottom: "12px" }}>
            The 40-Year Footwear Merchandising Lens
          </h2>
          <p>
            Long retail experience points to a simple lesson: unclear fit, ambiguous use cases, and overstated claims create avoidable disappointment. Morrow is designed to explain shape, width, feel, and intended use in plain language.
          </p>
          <p style={{ marginTop: "12px" }}>
            This fictional assortment focuses on understandable cushioning, secure fit, and construction details. Final performance and material claims require supplier evidence.
          </p>
        </section>

        <section style={{ background: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "16px" }}>
            Our Four Brand Pillars
          </h2>
          <div style={{ display: "grid", gap: "20px" }}>
            <div>
              <strong style={{ color: "var(--text-primary)", display: "block", fontSize: "1.1rem" }}>1. Joyful Biomechanics</strong>
              <span>Shoes should invite you out the door. We tune every midsole durometer to absorb shock while preserving lively ground feedback.</span>
            </div>
            <div>
              <strong style={{ color: "var(--text-primary)", display: "block", fontSize: "1.1rem" }}>2. Honest Commercial Integrity</strong>
              <span>No fake countdown timers. No manufactured artificial scarcity. Clearly labeled sample stock, straightforward pricing, and draft policies pending legal review.</span>
            </div>
            <div>
              <strong style={{ color: "var(--text-primary)", display: "block", fontSize: "1.1rem" }}>3. Material Accountability</strong>
              <span>Every future material claim must identify the component, composition, evidence, and reporting scope.</span>
            </div>
            <div>
              <strong style={{ color: "var(--text-primary)", display: "block", fontSize: "1.1rem" }}>4. Inclusive Fit Geometry</strong>
              <span>Feet come in diverse widths, insteps, and arch heights. Standard and Wide options are first-class citizens across our lineup.</span>
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", paddingTop: "20px" }}>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
            Experience the Morrow Difference
          </h2>
          <p style={{ marginBottom: "24px" }}>
            Take our 60-second stride quiz or browse the full performance assortment.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <Link href="/finder" className="btn btn-secondary">
              Take Shoe Finder Quiz
            </Link>
            <Link href="/new" className="btn btn-primary">
              Shop The Range →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
