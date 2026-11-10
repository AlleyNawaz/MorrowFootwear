import Link from "next/link";
import { notFound } from "next/navigation";
import { helpArticles } from "@/data/help";
export function generateStaticParams() {
  return helpArticles.map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: helpArticles.find((a) => a.slug === slug)?.title ?? "Help article",
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = helpArticles.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <main id="main-content" className="page container-narrow">
      <nav aria-label="Breadcrumb">
        <Link href="/help">Help</Link> / {article.title}
      </nav>
      <p className="eyebrow">DEMO HELP / SEPTEMBER 2026</p>
      <h1>{article.title}</h1>
      <div className="service-surface">
        <p>{article.copy}</p>
        <Link href={article.href} className="btn btn-primary">
          {article.action} →
        </Link>
      </div>
      <Link href="/contact">Other questions? Support information →</Link>
    </main>
  );
}
