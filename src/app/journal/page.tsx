import Link from "next/link";
import { JOURNAL_ARTICLES } from "@/lib/journal-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Morrow Journal — Science, Movement & Materials",
  description: "Biomechanical footwear research, runner injury prevention, foam engineering, and sustainability reports.",
};

export default function JournalHubPage() {
  return (
    <main id="main-content" className="page container">
      <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 48px" }}>
        <p className="eyebrow">EDITORIAL RESEARCH & CULTURE</p>
        <h1>The Morrow Journal</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px", fontSize: "1.05rem" }}>
          In-depth footwear engineering essays, biomechanics research, and circular material progress reports from our product lab.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
        {JOURNAL_ARTICLES.map((article) => (
          <article
            key={article.slug}
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-subtle)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "28px", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span className="badge subtle">{article.category}</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>{article.readTimeMinutes} min read</span>
              </div>

              <h2 style={{ fontSize: "1.35rem", marginBottom: "8px", lineHeight: 1.3 }}>
                <Link href={`/journal/${article.slug}`}>{article.title}</Link>
              </h2>

              <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", marginBottom: "20px", flex: 1, lineHeight: 1.6 }}>
                {article.excerpt}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border-subtle)", fontSize: "0.85rem" }}>
                <div>
                  <strong style={{ display: "block", color: "var(--text-primary)" }}>{article.author}</strong>
                  <span style={{ color: "var(--text-tertiary)" }}>{article.authorRole}</span>
                </div>
                <Link href={`/journal/${article.slug}`} className="btn btn-secondary btn-sm">
                  Read Article →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
