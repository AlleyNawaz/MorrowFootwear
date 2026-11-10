import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { JOURNAL_ARTICLES } from "@/lib/journal-data";
import { helpArticles } from '@/data/help';
import { collections } from '@/data/collections';
import { siteUrl } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;

  const staticRoutes = [
    "",
    "/new",
    "/running",
    "/walking",
    "/lifestyle",
    "/women",
    "/men",
    "/kids",
    "/finder",
    "/compare",
    "/stores",
    "/size-guide",
    "/journal",
    "/about",
    "/responsibility",
    "/help",
    "/contact",
    "/accessibility",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const journalRoutes = JOURNAL_ARTICLES.map((a) => ({
    url: `${baseUrl}/journal/${a.slug}`,
    lastModified: new Date(a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...journalRoutes, ...collections.map(c => ({ url: `${baseUrl}/collections/${c.slug}` })), ...helpArticles.map(article=>({url:`${baseUrl}/help/${article.slug}`}))];
}
