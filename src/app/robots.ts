import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/order-confirmation/", "/account", "/cart", "/order-status", "/returns/start", "/search"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
