import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, findProduct } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";

interface Props {
  params: Promise<{ slug: string }>;
}
export const dynamicParams = false;

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | Morrow Footwear`,
      description: product.description,
      images: [product.colors[0].image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) {
    notFound();
  }

  // Schema.org structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.colors.map((c) => c.image),
    description: `Fictional sample product. ${product.description}`,
    sku: product.styleCode,
    brand: {
      "@type": "Brand",
      name: "Morrow",
    },
    // No Offer or AggregateRating: this is not a real item for sale.
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetail key={product.slug} product={product} />
    </>
  );
}
