import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { collections } from "@/data/collections";
import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-grid";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return collections.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find(c => c.slug === slug);
  return collection ? { title: collection.title, description: collection.description, alternates: { canonical: `/collections/${slug}` } } : { title: "Collection not found" };
}
export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = collections.find(c => c.slug === slug);
  if (!collection) notFound();
  return <main id="main-content"><div className="section"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/new">Collection</Link> / {collection.title}</nav><p className="lede">{collection.description}</p></div><ProductGrid title={collection.title} items={products.filter(p => collection.categories.includes(p.category))} /></main>;
}
