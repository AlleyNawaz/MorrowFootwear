import Link from "next/link";
import { helpArticles } from "@/data/help";
export const metadata = {
  title: "Help and service",
  description: "Clear guidance for the Morrow demo store.",
};
export default function Page() {
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">SERVICE / WITHOUT THE GUESSWORK</p>
      <h1>A little guidance goes a long way.</h1>
      <p>
        Understand the sample store, find your fit, or follow a demo order. No
        live support team or carrier integration is connected.
      </p>
      <div className="service-nav">
        <Link href="/order-status">Order status</Link>
        <Link href="/returns/start">Start a return</Link>
        <Link href="/size-guide">Size guide</Link>
      </div>
      {helpArticles.map((article) => (
        <article className="service-surface" key={article.slug}>
          <h2>
            <Link href={`/help/${article.slug}`}>{article.title} ↗</Link>
          </h2>
          <p>{article.copy}</p>
        </article>
      ))}
    </main>
  );
}
