import { notFound } from "next/navigation";
import Link from "next/link";
import { JOURNAL_ARTICLES } from "@/lib/journal-data";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}
export const dynamicParams = false;

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: `${article.title} | Morrow Journal`,
    description: article.excerpt,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedProducts = products.filter((p) => article.relatedProductSlugs.includes(p.slug));

  return (
    <main id="main-content" className="page container-narrow">
      <nav aria-label="Breadcrumbs" style={{ display: "flex", gap: "8px", fontSize: "0.85rem", color: "var(--text-tertiary)", marginBottom: "24px" }}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/journal">Journal</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{article.title}</span>
      </nav>

      <article>
        <header style={{ marginBottom: "36px" }}>
          <span className="badge new" style={{ marginBottom: "12px" }}>{article.category}</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.2, marginBottom: "16px" }}>
            {article.title}
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "24px" }}>
            {article.subtitle}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", fontSize: "0.9rem" }}>
            <div>
              <strong style={{ display: "block" }}>{article.author}</strong>
              <span style={{ color: "var(--text-tertiary)" }}>{article.authorRole}</span>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right", color: "var(--text-tertiary)" }}>
              <span>Published: {article.publishedAt}</span> · <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>
        </header>

        {/* Lead Excerpt */}
        <div style={{ background: "var(--bg-subtle)", padding: "24px", borderRadius: "var(--radius-lg)", borderLeft: "4px solid var(--brand-cobalt)", marginBottom: "36px", fontStyle: "italic", fontSize: "1.05rem", lineHeight: 1.7 }}>
          &ldquo;{article.excerpt}&rdquo;
        </div>

        {/* Body Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-primary)" }}>
          {article.content.map((sec, i) => (
            <section key={i}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{sec.heading}</h2>
              <p style={{ color: "var(--text-secondary)" }}>{sec.body}</p>
            </section>
          ))}
        </div>
      </article>

      {/* Contextually Related Footwear */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "64px", paddingTop: "40px", borderTop: "1px solid var(--border-subtle)" }}>
          <p className="eyebrow">MENTIONED FOOTWEAR</p>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "20px" }}>Shoes Featured in This Article</h2>
          <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            {relatedProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
